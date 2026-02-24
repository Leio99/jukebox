import { CommonModule } from "@angular/common"
import { HttpClient } from "@angular/common/http"
import { ChangeDetectionStrategy, Component, signal, ViewChild } from "@angular/core"
import { FormControl, FormGroup } from "@angular/forms"
import { DomSanitizer } from "@angular/platform-browser"
import { YouTubePlayer, } from "@angular/youtube-player"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { faCirclePlay, faCirclePlus, faMinusCircle, faMusic, faShare } from "@fortawesome/free-solid-svg-icons"
import { AutocompleteConfig, ComboOption, DialogService, DirectivesModule, FormModule, LayoutModule, NotificationService, Subscriptable, TranslatePipe, TranslateService } from "dolfo-angular"
import { filter, map, Observable } from "rxjs"
import { WsMessageType } from "../../shared/interfaces"
import { Song, VideoStateChangeData, VideoStateChangeEvent, YoutubeVideo } from "../../shared/interfaces/video"
import { AuthService } from "../../shared/services"

@Component({
	selector: "jk-home",
	imports: [FormModule, CommonModule, TranslatePipe, LayoutModule, DirectivesModule, FaIconComponent, YouTubePlayer],
	templateUrl: "./home.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends Subscriptable{
	@ViewChild("player") player: YouTubePlayer
	private readonly API_KEY = "AIzaSyDgHFW4Gtv7wPzQsiQ60rT0JSm_6GRP-bA"
	public readonly ICONS = { faCirclePlay, faMusic, faCirclePlus, faMinusCircle, faShare }

	public currentPlay = signal<string>(null)
	public isOwner = signal(false)
	public songs$: Observable<Song[]>

	public form = new FormGroup({
		song: new FormControl(null)
	})

	constructor(
		private authService: AuthService,
		private httpClient: HttpClient,
		private sanitizer: DomSanitizer,
		private dialogService: DialogService,
		private notificationService: NotificationService,
		private translateService: TranslateService
	){
		super()

		this.songs$ = this.authService.getUser$().pipe(
			filter(u => !!u),
			map(v => {
				this.isOwner.set(v.isOwner)
				return v.songs
			})
		)

		this.addSubscription(this.songs$.subscribe(songs => {
			if(songs.length > 0 && songs[0].id !== this.currentPlay())
				this.currentPlay.set(songs[0].id)
			else if(songs.length === 0)
				this.currentPlay.set(null)
		}))
	}

	public config: AutocompleteConfig<YoutubeVideo> = {
		search$: filter => this.httpClient.get<{ items: any[] }>(
			`https://www.googleapis.com/youtube/v3/search?q=${filter}&part=snippet&key=${this.API_KEY}&type=video`
		).pipe(
			map(d => d.items as YoutubeVideo[])
		),
		getLabel: item => item.snippet.title + " • " + item.snippet.channelTitle
	}

	public findOption = (opt: ComboOption) => this.convertToSong(opt.value)

	public convertToSong = ({ id, snippet }: YoutubeVideo): Song => ({
		id: id.videoId,
		channelName: snippet.channelTitle,
		title: snippet.title,
		datePublished: snippet.publishedAt,
		thumbUrl: snippet.thumbnails.default.url
	})

	public getSanitizedTitle = (title: string) => this.sanitizer.bypassSecurityTrustHtml(title)

	public cambiaStato = (ev: VideoStateChangeEvent) => {
		if(ev.data === VideoStateChangeData.VIDEO_ENDED)
			this.authService.sendMessage(WsMessageType.END_SONG, this.currentPlay())
	}

	public addSong = () => {
		this.authService.sendMessage(WsMessageType.ADD_SONG, this.convertToSong(this.form.get("song").value))
		this.form.reset()
	}

	public addSongAndPlay = () => {
		this.authService.sendMessage(WsMessageType.ADD_SONG_FIRST, this.convertToSong(this.form.get("song").value))
		this.form.reset()
	}

	public removeSong = (id: string) => this.authService.sendMessage(WsMessageType.REMOVE_SONG, id)

	public share = () => {
		const control = new FormControl({ value: this.authService.getUser().roomId, disabled: true })

		this.dialogService.openDialog({
			form: [{
				control,
				name: "link",
				type: "text"
			}],
			message: null,
			title: this.translateService.translate("room.shareTitle"),
			width: 400,
			buttons: [{
				color: "primary",
				label: this.translateService.translate("room.copy"),
				icon: "copy",
				onClick: () => {
					navigator.clipboard.writeText(control.value)
					this.dialogService.close()
					this.notificationService.show({
						type: "info",
						title: this.translateService.translate("notification.info"),
						message: this.translateService.translate("room.copied")
					})
				}
			}]
		}).subscribe()
	}
}
