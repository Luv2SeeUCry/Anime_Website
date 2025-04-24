<?php
require_once '../config/auth.php';
require_once '../config/database.php';

// Verify admin access
if (!isAdmin()) {
    header('Location: ../login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - AnimeVerse</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    <style>
        .admin-sidebar {
            background: #1a1a1a;
            min-height: 100vh;
            padding: 20px;
        }
        .content-area {
            background: #f5f5f5;
            padding: 20px;
        }
        .stats-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Admin Sidebar -->
            <div class="col-md-2 admin-sidebar text-white">
                <h3>Admin Panel</h3>
                <nav class="mt-4">
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a href="#" class="nav-link text-white" data-page="dashboard">
                                <i class="fas fa-home"></i> Dashboard
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link text-white" data-page="articles">
                                <i class="fas fa-pen"></i> Articles
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link text-white" data-page="users">
                                <i class="fas fa-users"></i> Users
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link text-white" data-page="donations">
                                <i class="fas fa-gift"></i> Donations
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            <!-- Content Area -->
            <div class="col-md-10 content-area">
                <div id="dashboardContent">
                    <!-- Dynamic content will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Article Editor Modal -->
    <div class="modal fade" id="articleEditor" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Article</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="articleForm">
                        <input type="text" class="form-control mb-3" placeholder="Article Title">
                        <div id="editor" style="height: 300px;"></div>
                        <input type="text" class="form-control mt-3" placeholder="Google Drive Link">
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="saveArticle()">Save</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
    <script src="js/admin.js"></script>
</body>
</html>