const fs = require("fs");

function ensureBackupDirExists() {
    const backupsDir = './backups';
    if (!fs.existsSync(backupsDir)){
        fs.mkdirSync(backupsDir, { recursive: true });
    }
}

function backupLeaderboard() {
    const timestamp = new Date().toISOString().replace(/:/g, '-'); // Replace colons for filesystem compatibility
    const backupFilePath = `./backups/leaderboard-backup-${timestamp}.json`;
    fs.writeFileSync(backupFilePath, JSON.stringify(leaderboard, null, 2), 'utf8');
    console.log(`Backup saved at ${backupFilePath}`);
}

function initBackup(backupInterval){
    ensureBackupDirExists();
// Set an interval to back up the leaderboard every 2 minutes
    setInterval(() => {
        ensureBackupDirExists(); // Check if directory exists before backup
        backupLeaderboard();
    }, backupInterval);
}

module.exports = {
    initBackup
};