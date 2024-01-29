from pytube import YouTube
from tkinter import filedialog
import sys


def download_video(url, save_path):
    try:
        yt = YouTube(url)
        # progressive streams to single - high res, limits quality for others
        streams = yt.streams.filter(progressive=True, file_extension="mp4")
        highest_res_stream = streams.get_highest_resolution()
        highest_res_stream.download(output_path=save_path)
        print("Video downloaded successfully!")

        # adaptive streams for all - good quality, greater availability
        # streams = yt.streams.filter(adaptive=True, res="1080p", file_extension="mp4")
        # streams.first().download(output_path=save_path)
        # print("Video downloaded successfully!")
    except Exception as e:
        print(e)


def open_file_dialog():
    folder = filedialog.askdirectory()
    if folder:
        print(f"Selected folder: {folder}")

    return folder


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 youtube-video-downloader.py <video_url>")
        sys.exit(1)

    video_url = sys.argv[1]

    if "https://www.youtube.com/watch?v=" not in video_url:
        print("Url must contain 'https://www.youtube.com/watch?v='")
        sys.exit(1)

    save_dir = open_file_dialog()

    if save_dir:
        print("Started download...")
        download_video(video_url, save_dir)
    else:
        print("Invalid save location")
