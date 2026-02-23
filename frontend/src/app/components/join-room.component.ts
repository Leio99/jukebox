import { CommonModule } from "@angular/common"
import { ChangeDetectionStrategy, Component, inject } from "@angular/core"
import { FormControl, FormGroup, Validators } from "@angular/forms"
import { Formable, FormModule, LayoutModule, TranslatePipe } from "dolfo-angular"
import { BehaviorSubject, catchError, throwError } from "rxjs"
import { User } from "../shared/interfaces"
import { AuthService } from "../shared/services"

@Component({
	selector: "jk-join-room",
	imports: [FormModule, TranslatePipe, CommonModule, LayoutModule],
	template: `<div class="join-container">
		<div class="new-room">
			<dolfo-button color="success" (onClick)="newRoom()" [disabled]="loading$ | async" [loading]="loadingRoom$ | async">
				{{ "join.newRoom" | translate }}
			</dolfo-button>
		</div>
		<form class="join-room" [formGroup]="form">
			<dolfo-input-text formControlName="roomId" [label]="'join.roomId' | translate"></dolfo-input-text>

			<dolfo-button [loading]="loading$ | async" [disabled]="loadingRoom$ | async" type="submit">{{ "join.doJoin" | translate }}</dolfo-button>
		</form>
	</div>`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class JoinRoomComponent extends Formable<User>{
	public form = new FormGroup({
		roomId: new FormControl(null, Validators.required)
	})

	public loadingRoom$ = new BehaviorSubject(false)

	private authService = inject(AuthService)

	protected override submit = (formValue: User) => this.authService.join$(formValue.roomId)

	public newRoom = () => {
		this.loadingRoom$.next(true)
		this.form.disable()

		this.authService.join$().pipe(
			catchError(err => {
				this.form.enable()
				this.loadingRoom$.next(false)
				return throwError(() => err)
			})
		).subscribe()
	}
}
