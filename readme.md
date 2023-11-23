# Real-Time Leaderboard

This project implements a real-time leaderboard with a dashboard for adding, updating, and deleting player scores. It's built with Node.js, Express, Socket.IO, and Tailwind CSS for a modern and responsive UI.

## Features

  - Real-time updates across all connected clients using WebSockets.
  - Editable leaderboard dashboard with add, update, and delete entries functionality.
  - **[SOON]** A REST Http API to add, update, and delete entries.
  - A sorted leaderboard that automatically orders players by their score.
  - A sleek, responsive UI styled with Tailwind CSS.

## Installation

To get started with this project, clone the repository and install the dependencies:

```bash
git clone https://github.com/LeoFabre/EZLeaderboard
cd leaderboard
yarn install
```

## Usage

To run the server, use the following command:

```bash
yarn start
```

To watch for changes to CSS and recompile with Tailwind CSS, use:

```bash
yarn watch-css
```

Open http://localhost:3000/dashboard to view the dashboard and manage the leaderboard.  
Open http://localhost:3000/ in a separate window to view the real-time leaderboard.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

  - Fork the Project
  - Create your Feature Branch (git checkout -b feature/AmazingFeature)
  - Commit your Changes (git commit -m 'Add some AmazingFeature')
  - Push to the Branch (git push origin feature/AmazingFeature)
  - Open a Pull Request

## License

Distributed under the GPL-3.0 License. 

## Contact

Leo Fabre - contact@neoxure.com

Project Link: https://github.com/LeoFabre/EZLeaderboard

## Acknowledgments

  - Node.js
  - Express
  - Socket.IO
  - Tailwind CSS
