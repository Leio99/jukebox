export interface YoutubeVideo{
  readonly id: {
    readonly videoId: string
  }
  readonly snippet: VideoSnippet
}

export interface VideoSnippet{
  readonly title: string
  readonly publishedAt: string
  readonly channelTitle: string
  readonly thumbnails: {
    readonly default: { url: string }
  }
}

export interface Song{
    readonly id: string
    readonly thumbUrl: string
    readonly channelName: string
    readonly title: string
    readonly datePublished: string
}

export interface VideoWithDetails{
  readonly contentDetails: {
    readonly duration: string
  }
}

export enum VideoStateChangeData{ VIDEO_ENDED }

export interface VideoStateChangeEvent{
  readonly data: number
}