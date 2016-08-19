#$!/bin/bash
#This script
#1. Automatically downloads Western Canada cloud forecast images from weather.gc.ca for today's date
#   (Forecasts start at +3UTC and go for every hour to +48 UTC)
#2. Crops the images, converts to TIFF
#3. Add's GEOTiff Data (very rough approximation right now)
#4. Converts to tiled map for use with leaflet using GDAL2Tiles
#
#See README for dependencies

mkdir -p cloud-data
#Predictions go from 3..48 hours
N_MIN=3
N_MAX=48

#Indexed on weather site by following datecode
datecode=$(date +"%Y%m%d")

counter=$N_MIN

#Construct address and download with wget
#save files to ./cloud-data
while [ $counter -le $N_MAX ]
do

	fileStart="http://weather.gc.ca/data/prog/regional/"
	fileDate="$datecode""00/""$datecode"
	fileEnd="00_054_R1_north@america@northwest_I_ASTRO_nt_$(printf %03d $counter).png"

	fileAddress=$fileStart$fileDate$fileEnd

	echo "Downloading $counter of $N_MAX"

	outputFile="./cloud-data/western_canada_t$counter.png"

	wget -t1 --output-document=$outputFile --directory-prefix=./cloud-data $fileAddress

	let counter=counter+1
done


#Crop images, set map boundries to transparent, convert to tiff
counter=$N_MIN

while [ $counter -le $N_MAX ]
do
	echo "Converting $counter of $N_MAX"
	input="./cloud-data/western_canada_t$counter.png"
	output="./cloud-data/western_canada_t$counter.tif"
	convert $input -transparent 'rgb(254, 0, 0)' -crop 657x541+3+47 $output

	#Delete .png files
	rm $input
	let counter=counter+1
done

#Convert to GeoTIFF
counter=$N_MIN
while [ $counter -le $N_MAX ]
do
	echo "Adding Geo data $counter of $N_MAX"
	input="./cloud-data/western_canada_t$counter.tif"
	output="./cloud-data/western_canada_t""$counter""_geo.tif"
	geotifcp -g western_canada_metadata.txt $input $output

	#Delete original without geo data
	rm $input
	let counter=counter+1
done

#Tile with gdal2tiles.py
counter=$N_MIN
while [ $counter -le $N_MAX ]
do
	input="./cloud-data/western_canada_t""$counter""_geo.tif"
	output="./cloud-data/western_canada_t""$counter""_geo"
	echo "Tiling $input - $counter of $N_MAX"
	#Zoom levels 0-7, create leaflet map
	python gdal2tiles.py -z 0-7 -w leaflet $input $output
	let counter=counter+1
done


