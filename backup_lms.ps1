# backup_lms.ps1
# Script tự động backup Database (MySQL) và Files (MinIO) cho LMS TOEIC

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFolder = "backups"
$BackupName = "lms_backup_$Timestamp"
$TempDir = "$BackupFolder\temp_$Timestamp"

# 1. Tạo thư mục chứa backup nếu chưa có
if (-not (Test-Path $BackupFolder)) {
    New-Item -ItemType Directory -Path $BackupFolder | Out-Null
}
New-Item -ItemType Directory -Path $TempDir | Out-Null

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " BẮT ĐẦU TIẾN TRÌNH BACKUP LMS TOEIC..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 2. Backup MySQL bằng mysqldump
Write-Host "[1/3] Đang xuất dữ liệu Database (MySQL)..." -ForegroundColor Yellow
$SqlFile = "$TempDir\lms_toeic_database.sql"
# Dùng cmd /c để handle việc redirect output stream (>) chính xác hơn trong Docker
cmd.exe /c "docker exec -i lms-toeic-mysql mysqldump -uroot -p123456 lms_toeic > `"$SqlFile`""
if ($LASTEXITCODE -ne 0) {
    Write-Host "Lỗi khi backup Database!" -ForegroundColor Red
} else {
    Write-Host "  -> Backup Database xong." -ForegroundColor Green
}

# 3. Backup MinIO (File upload)
Write-Host "[2/3] Đang copy file upload (Hình ảnh, Audio từ MinIO)..." -ForegroundColor Yellow
$MinioBackupDir = "$TempDir\minio_data"
docker cp lms-toeic-minio:/data $MinioBackupDir
if ($LASTEXITCODE -ne 0) {
    Write-Host "Lỗi khi copy file từ MinIO!" -ForegroundColor Red
} else {
    Write-Host "  -> Backup File xong." -ForegroundColor Green
}

# 4. Nén (Zip) lại thành 1 file duy nhất
Write-Host "[3/3] Đang nén tất cả thành 1 file .zip duy nhất..." -ForegroundColor Yellow
$ZipFile = "$BackupFolder\$BackupName.zip"
Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipFile

# 5. Dọn dẹp thư mục tạm
Write-Host "Đang dọn dẹp thư mục tạm..." -ForegroundColor Yellow
Remove-Item -Path $TempDir -Recurse -Force

# 6. Xoá các bản backup cũ (chỉ giữ lại file mới nhất)
Write-Host "Đang dọn dẹp các bản backup cũ..." -ForegroundColor Yellow
$BackupFiles = Get-ChildItem -Path $BackupFolder -Filter "lms_backup_*.zip" | Sort-Object LastWriteTime -Descending
if ($BackupFiles.Count -gt 1) {
    $OldBackups = $BackupFiles | Select-Object -Skip 1
    $OldBackups | Remove-Item -Force
    Write-Host "  -> Đã xoá $($OldBackups.Count) file backup cũ." -ForegroundColor Green
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " BACKUP THÀNH CÔNG! 🎉" -ForegroundColor Green
Write-Host " File backup an toàn của bạn nằm ở: $ZipFile" -ForegroundColor White
Write-Host "=========================================" -ForegroundColor Cyan

# Dừng màn hình 5 giây (nếu chạy bằng cách click đúp)
Start-Sleep -Seconds 5
