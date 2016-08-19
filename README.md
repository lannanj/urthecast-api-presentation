# Urthecast Cloud Prediction Demo
This project started with the Urthecast Web Demo files and looks at predicting the cloud cover the next time a given satellite has a capture opportunity in the given AOI. It does this using cloud coverage predictions that are produced by [Environment Canada](https://weather.gc.ca/astro/clds_vis_e.html) for astronomers. It is a work in progress.

* If you want to look at sample run without downloading any data, just open [example.pdf](example.pdf)

## Getting started - Running with existing cloud data
This option requires no additional software packages, simply clone a local copy of this project AND extract [this sample data](https://drive.google.com/drive/folders/0B60kmobEsFEqNnpJNlJ5OVlYUmc?usp=sharing) (create ./cloud-data folder). The predictions will obviously be for the past (this data was generated on 2016-08-19). Same instructions as the original demo:

* Open `index.html` in Chrome
* Navigate through the presentation using the space bar or the arrow keys (left/right/up/down). The available directions are visible in the bottom right corner.

Important things to note:

* All "live" demos require an API key / secret
* You will need to create an account at https://developers.urthecast.com to get an API key / secret

## Running with new cloud data
To update with the latest cloud predictions you will need to install the following:
- [Python 2.7](https://www.python.org/)
- [GDAL](http://gdal.org) (Make sure you run setup.py)
- [GeoTIFF Library](https://trac.osgeo.org/geotiff/) and its dependencies
- [ImageMagick](https://imagemagick.org)

Simply run update-cloud-data.sh and it will automatically update the ./cloud-data by:
- Downloading latest data from Environment Canada
- Cropping and setting the political borders to transparent
- Converting to GeoTIFF
- Tiling the map for use in Leaflet

## Improvements
- Shell scripting is very basic, not robust.
- The GeoTIFF tagging is VERY preliminary using a limited number of tie points and an unknown scaling. Lots of room for improvement here.
- Better image resizing may increase sharpness at higher zoom levels

... And it would obviously be nice to start comparing predictions against actual captured images!



[Environment Canada]:
[this sample data]:
[Python 2.7]:
[GDAL]:
[GEOTIFF Library]:
[ImageMagick]:
