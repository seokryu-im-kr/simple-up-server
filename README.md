# simple-up

simple upload webpage.

Flask+ 

# Simple File Upload Service

A lightweight file upload web application built with **Flask** and styled with **Tailwind CSS**. Designed for handling file uploads via both a web interface and direct API calls (PUT requests).

## Features

- **File Upload**: Upload files up to 1GB.
- **Secure Filenames**: Automatically sanitizes filenames and adds timestamps to prevent collisions.

## Prerequisites

- **Python** 3.12+
- **Node.js** & **npm** (for building Tailwind CSS)

## Configuration

The application is configured to save uploaded files to `/mnt/nfs` by default.

## Project Structure

- `app.py`: Main Flask application logic.
- `templates/`: HTML templates (Jinja2).
- `static/src/`: Source CSS files (Tailwind input).
- `static/css/`: Compiled CSS files.
- `static/js/`: Frontend JavaScript.
- `package.json`: Frontend dependencies and scripts.
