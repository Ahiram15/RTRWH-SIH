#!/usr/bin/env python3
"""
Script to convert all available shapefiles in the data directory to GeoJSON files.
"""

import geopandas as gpd
import os
from pathlib import Path

# Data directory
DATA_DIR = Path(__file__).parent / 'data'

# Output directory for GeoJSON files
OUTPUT_DIR = DATA_DIR / 'geojson'
OUTPUT_DIR.mkdir(exist_ok=True)

def convert_shapefile_to_geojson(shapefile_path, output_path):
    print(f"Converting {shapefile_path} to {output_path}")
    try:
        gdf = gpd.read_file(str(shapefile_path))
        if gdf.empty:
            print(f"ERROR: Shapefile {shapefile_path} is empty or could not be read.")
            return False
        # Convert CRS to WGS84 (EPSG:4326) if not already
        if gdf.crs != 'EPSG:4326':
            print("Converting CRS to WGS84 (EPSG:4326)...")
            gdf = gdf.to_crs('EPSG:4326')
        gdf.to_file(str(output_path), driver="GeoJSON")
        print(f"Successfully converted to {output_path}")
        return True
    except Exception as e:
        print(f"ERROR converting {shapefile_path}: {str(e)}")
        return False

def convert_all_shapefiles():
    print("Discovering shapefiles in data directory...")
    shapefiles = list(DATA_DIR.rglob("*.shp"))
    print(f"Found {len(shapefiles)} shapefile(s)")
    if not shapefiles:
        print("No shapefiles found in data directory.")
        return False
    success_count = 0
    for shapefile_path in shapefiles:
        filename = shapefile_path.stem + ".geojson"
        output_path = OUTPUT_DIR / filename
        print(f"\n{'='*50}")
        print(f"Processing: {shapefile_path.name}")
        print(f"{'='*50}")
        if convert_shapefile_to_geojson(shapefile_path, output_path):
            success_count += 1
        else:
            print(f"Failed to convert {shapefile_path.name}")
    print(f"\n{'='*50}")
    print(f"Conversion complete: {success_count}/{len(shapefiles)} shapefiles converted successfully")
    print(f"{'='*50}")

if __name__ == '__main__':
    if not convert_all_shapefiles():
        exit(1)
