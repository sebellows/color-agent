# Project Brief: ColorAgent

## Overview
ColorAgent is a platform for comparing and contrasting paint products in the miniature gaming hobby space. It can help hobbyists find comparable paints by color, price, product type, and availability. It also allows users to create color schemes to use on their next projects and to keep inventory of paints they have and paints they want.

## Core Requirements

### Platform Support

Application should be developed for:

- Native mobile devices (Apple and Android)
- Current evergreen browsers

### Content Aggregation

- Source product data for paints from popular manufacturers
- Parse images and product data for color information and categorize them by color range and ISCC-NBS color category
- Track when data was originally sourced and when it was last updated

## Goals

1. Create a reliable platform for searching for products by color and product type
2. Enable users to save and update lists of products
3. Allow rating and tagging of products by users for weighted categorization of products

## Technical Requirements

- High reliability and uptime
- Scalable architecture
- Efficient resource usage
- Comprehensive error handling
- Graceful degradation
- Containerized deployment with Docker
- PostgreSQL database with proper security measures
