# 🎓 MPSTME Campus Lost & Found Portal
### *A Secure, 3-Tier Web Utility for SVKM's NMIMS*

---

## 📝 Project Overview
This platform is a centralized digital directory developed for **MPSTME** to streamline the process of reporting and recovering misplaced items on campus. Built using a robust 3-tier architecture, the portal ensures data integrity, secure administrative oversight, and a responsive user experience tailored to the university's official branding.

---

## 🚀 Key Features

### 🔹 For the Student Body
* **Official Reporting System:** Simple, validated forms for logging Lost or Found items.
* **Multimedia Integration:** Support for image uploads to aid in the visual identification of belongings.
* **Real-time Directory:** A searchable and filterable list of all items, powered by AngularJS for instant results.
* **Dynamic Status Badges:** Visual indicators showing whether an item is currently "Lost," "Found," or has been "Claimed."

### 🔹 For Administration (Security Focused)
* **Authentication Gateway:** A secure login system preventing unauthorized access to the management dashboard.
* **Full CRUD Lifecycle:** Administrative power to Create, Read, Update (modify status), and Delete records to keep the directory clean.
* **Session Management:** Uses browser session tokens to maintain a secure environment during administrative tasks.

---

## 🛠️ Technical Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, AngularJS (SPA Framework) |
| **Backend** | PHP (Server-side Logic & File Handling) |
| **Database** | MySQL (Relational Data Storage) |
| **Server** | XAMPP (Apache Environment) |
| **Architecture** | 3-Tier (Presentation, Application, Data) |

---

## ⚙️ Installation & Setup

To run this project on a local machine, follow these technical steps:

1. **Clone the Repository:** Place the project files into your local server directory, typically `C:\xampp\htdocs\lost_found\`.

2. **Database Configuration:** * Access **phpMyAdmin** via XAMPP.
   * Create a new database titled `college_lost_found`.
   * Import the provided `database.sql` file to automatically generate the `items` table and sample data.

3. **Directory Setup:** * Ensure an empty folder named `uploads` exists in the project root to store submitted images.

4. **Launch:** * Start **Apache** and **MySQL** from the XAMPP Control Panel.
   * Navigate to `http://localhost/lost_found/` in any modern web browser.

---

## 🗄️ Database Schema Details
The system relies on a structured MySQL table with the following attributes:

* **id:** Unique identifier (Primary Key).
* **item_name:** Formal name of the reported object.
* **description:** Detailed characteristics (color, brand, marks).
* **category:** Organized by Electronics, Documents, Accessories, etc.
* **location:** Specific campus area (e.g., Library, 4th Floor Lab).
* **status:** Current state (Lost/Found/Claimed).
* **image_name:** Reference path to the stored server-side image.
* **contact_info:** User-provided email or phone for recovery.

---

## 👤 Developer Information
**Sanidhya Singh Sisodiya** *Computer Engineering Student* **MPSTME, SVKM's NMIMS**

---
*"Engineered with precision to turn lost belongings into found memories across the MPSTME campus."*
