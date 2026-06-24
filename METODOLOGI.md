# BAGIAN III: METODOLOGI

## 1. ANALISIS DAN PERANCANGAN SISTEM

### 1.1 Analisis Sistem

#### 1.1.1 Identifikasi Masalah
Sistem Klasifikasi Penyakit Potato (PCD) dirancang untuk mengatasi:
- **Masalah utama**: Kesulitan petani mengidentifikasi jenis penyakit pada tanaman kentang secara akurat dan cepat
- **Dampak**: Penanganan yang tidak tepat dapat menyebabkan kerugian ekonomi yang signifikan
- **Solusi**: Sistem berbasis AI yang dapat mengklasifikasi penyakit secara otomatis hanya dengan mengunggah foto

#### 1.1.2 Persyaratan Sistem

**Persyaratan Fungsional:**
- Menerima unggahan gambar penyakit potato dari pengguna
- Memproses gambar dan melakukan prediksi menggunakan model ML
- Menampilkan hasil klasifikasi dengan tingkat kepercayaan
- Menampilkan informasi detail tentang penyakit yang terdeteksi

**Persyaratan Non-Fungsional:**
- **Performance**: Response time < 2 detik untuk prediksi
- **Keamanan**: Validasi file, CORS protection, error handling
- **Scalability**: Dapat menangani multiple concurrent requests
- **Usability**: Interface yang user-friendly dan responsif

#### 1.1.3 Analisis Pengguna
- **Pengguna Utama**: Petani, agronomist, penyuluh pertanian
- **Tingkat Teknologi**: Menengah hingga dasar
- **Kebutuhan**: Interface sederhana, hasil yang jelas dan akurat

---

## 2. DESAIN SISTEM

### 2.1 Deskripsi Umum Sistem
Sistem klasifikasi penyakit potato adalah aplikasi web full-stack yang menggabungkan:
- **Machine Learning Model**: Deep Learning dengan transfer learning
- **Backend API**: FastAPI untuk REST endpoints
- **Frontend UI**: React dengan Material-UI
- **Model Training**: Jupyter Notebook dengan TensorFlow/Keras

### 2.2 Komponen-Komponen Sistem

#### 2.2.1 Training Module
- **Framework**: TensorFlow/Keras
- **Model Base**: EfficientNetV2B0 (transfer learning)
- **Dataset**: Gambar penyakit potato dari 7 kelas
- **Output**: Saved model dalam format SavedModel

#### 2.2.2 Backend API
- **Framework**: FastAPI
- **Fungsi**: Menerima gambar, melakukan prediksi, mengembalikan hasil
- **Port**: 8000 (localhost)
- **Endpoints**: 
  - GET `/ping` - Health check
  - POST `/predict` - Prediksi penyakit

#### 2.2.3 Frontend Application
- **Framework**: React
- **UI Library**: Material-UI
- **Fungsi**: Interface untuk upload dan display hasil
- **Port**: 3000 (localhost)

---

## 3. RANCANGAN ARSITEKTUR SISTEM

### 3.1 Arsitektur Tingkat Tinggi

```
┌─────────────────────────────────────────────────────────────┐
│                    POTATO DISEASE CLASSIFIER                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            FRONTEND LAYER (React)                     │   │
│  │  • Image Upload Component                             │   │
│  │  • Preview & Display Results                          │   │
│  │  • Material-UI Components                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↕ (HTTP/CORS)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             API LAYER (FastAPI)                       │   │
│  │  • CORS Middleware                                    │   │
│  │  • File Validation                                    │   │
│  │  • Image Preprocessing                               │   │
│  │  • Prediction Logic                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↕ (Binary)                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            ML MODEL LAYER                             │   │
│  │  • EfficientNetV2B0 Base Model                        │   │
│  │  • Custom Classification Head                         │   │
│  │  • 7 Class Output Layer                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Arsitektur Model Machine Learning

```
INPUT IMAGE (224x224x3)
        ↓
[Preprocessing]
 • Resize to 224x224
 • Normalize pixel values
        ↓
[EfficientNetV2B0 Base]
 • Pre-trained on ImageNet
 • Transfer Learning
        ↓
[Custom Head]
 • GlobalAveragePooling2D
 • BatchNormalization
 • Dense(256, relu) + Dropout(0.5)
 • Dense(128, relu) + Dropout(0.4)
 • Dense(7, softmax) → Output
        ↓
[Classification Output]
 • Probability distribution across 7 classes
 • Argmax for predicted class
```

### 3.3 Alur Data End-to-End

```
User Upload Image
       ↓
Frontend (React)
 ├─ Validate file type
 ├─ Create FormData
 └─ POST to API
       ↓
Backend (FastAPI)
 ├─ Receive file
 ├─ Validate image format
 ├─ Convert to RGB
 ├─ Resize to 224x224
 ├─ Expand dims for batch
 └─ Load & prepare image array
       ↓
ML Model Inference
 ├─ Pass through EfficientNetV2B0
 ├─ Extract predictions [0]
 ├─ Get probabilities for 7 classes
 └─ Calculate confidence
       ↓
Response
 ├─ class: Predicted disease name
 ├─ confidence: Probability (0-1)
 └─ Return JSON to Frontend
       ↓
Frontend Display
 ├─ Show image preview
 ├─ Display disease name
 ├─ Show confidence percentage
 └─ Render results
```

---

## 4. DIAGRAM ALUR SISTEM

### 4.1 Flowchart Proses Prediksi

```
START
  │
  ├─→ User selects image file
  │
  ├─→ Frontend validates file type
  │     └─→ Is image? NO → Show error
  │     └─→ YES → Continue
  │
  ├─→ Display preview image
  │
  ├─→ Auto-send to API
  │
  ├─→ Backend receives request
  │
  ├─→ Validate file again
  │     └─→ Valid? NO → Return 400
  │     └─→ YES → Continue
  │
  ├─→ Process image
  │     ├─ Load image
  │     ├─ Convert to RGB
  │     ├─ Resize to 224x224
  │     ├─ Convert to array
  │     └─ Expand dims to (1, 224, 224, 3)
  │
  ├─→ Load ML Model
  │     └─→ EfficientNetV2B0 + Custom Head
  │
  ├─→ Run prediction
  │     ├─ Get probability distribution
  │     ├─ Find argmax (predicted class)
  │     └─ Get confidence score
  │
  ├─→ Prepare response
  │     ├─ class: CLASS_NAMES[predicted_idx]
  │     └─ confidence: float(max_probability)
  │
  ├─→ Return JSON response (200 OK)
  │
  ├─→ Frontend receives response
  │
  ├─→ Display results
  │     ├─ Disease name
  │     ├─ Confidence %
  │     └─ Show clear button
  │
  ├─→ User can clear and retry
  │
  END
```

### 4.2 Diagram Sequence Sistem

```
User          Frontend        Backend        ML Model
 │               │              │              │
 ├─Select Image─→│              │              │
 │               ├─Validate─→   │              │
 │               │              │              │
 │               ├─Show Preview  │              │
 │               │              │              │
 │               ├─Auto Upload─→ │              │
 │               │              ├─Validate     │
 │               │              ├─Preprocess   │
 │               │              ├─Load Model─→ │
 │               │              │ Load         │
 │               │              │←─Model Ready─│
 │               │              │              │
 │               │              ├─Predict────→ │
 │               │              │ Process      │
 │               │              │←─Prediction  │
 │               │              │              │
 │               │←─Response────┤              │
 │               ├─Parse JSON   │              │
 │               ├─Display      │              │
 │               │  Results     │              │
 │←─Show Results─│              │              │
```

### 4.3 Flowchart Training Model

```
START
  │
  ├─→ Load dataset dari folder 'dataset/'
  │     ├─ 7 kelas penyakit potato
  │     └─ Split: train/val/test
  │
  ├─→ Image augmentation
  │     ├─ Random flip
  │     ├─ Random rotation
  │     ├─ Random zoom
  │     ├─ Random contrast
  │     ├─ Random brightness
  │     └─ Random translation
  │
  ├─→ Build Model
  │     ├─ Load EfficientNetV2B0 (pretrained)
  │     ├─ Freeze base model
  │     ├─ Add custom head
  │     └─ Compile model
  │
  ├─→ PHASE 1: Train classification head
  │     ├─ Epochs: up to 100
  │     ├─ Base model: FROZEN
  │     ├─ Train: Custom layers only
  │     ├─ Callbacks:
  │     │   ├─ EarlyStopping
  │     │   ├─ ModelCheckpoint → saved_model/phase1
  │     │   └─ ReduceLROnPlateau
  │     └─ Save best model
  │
  ├─→ PHASE 2: Fine-tuning
  │     ├─ Unfreeze last 20 layers base model
  │     ├─ Lower learning rate (1e-5)
  │     ├─ Epochs: up to 50
  │     ├─ Callbacks:
  │     │   ├─ EarlyStopping (patience=15)
  │     │   ├─ ModelCheckpoint → saved_model/final
  │     │   └─ ReduceLROnPlateau
  │     └─ Save best model
  │
  ├─→ Evaluate on test set
  │     ├─ Calculate accuracy
  │     ├─ Calculate loss
  │     └─ Display metrics
  │
  ├─→ Generate reports
  │     ├─ Classification report
  │     ├─ Confusion matrix
  │     ├─ Training history plot
  │     └─ Save visualizations
  │
  ├─→ Final model saved to: saved_model/final/
  │
  END
```

---

## 5. PERANCANGAN DFD (Data Flow Diagram) & UML

### 5.1 Data Flow Diagram - Level 0 (Context Diagram)

```
                            ┌─────────────────┐
                            │     Pengguna    │
                            │    (Petani)     │
                            └────────┬────────┘
                                     │
                          Image File │ Hasil Prediksi
                                     │
                    ┌────────────────┴─────────────────┐
                    │                                  │
                    ▼                                  │
          ┌──────────────────────┐                     │
          │      Frontend        │◄────────────────────┘
          │  Image Upload UI     │
          └──────────┬───────────┘
                     │
        Request JSON │ Response JSON
                     │
                    ▼
          ┌──────────────────────┐
          │    Backend API       │
          │   (FastAPI)          │
          └──────────┬───────────┘
                     │
         Model Path  │ Predictions
                     │
                    ▼
          ┌──────────────────────┐
          │    ML Model          │
          │   (TensorFlow)       │
          └──────────────────────┘
```

### 5.2 Data Flow Diagram - Level 1 (Prediction Process)

```
┌───────────────┐
│ Upload Image  │
└───────┬───────┘
        │ Image File
        ▼
   ┌─────────────────────────────┐
   │  1.0 Validasi File          │
   │  • Check MIME type          │
   │  • Check file size          │
   └────────┬────────────────────┘
            │ Valid? 
            ├─NO→ Error Response
            │
            │ YES
            ▼
   ┌─────────────────────────────┐
   │  2.0 Preprocessing Image    │
   │  • Load image               │
   │  • Convert RGB              │
   │  • Resize 224x224           │
   │  • Array conversion         │
   │  • Batch expand             │
   └────────┬────────────────────┘
            │ Preprocessed Image
            ▼
   ┌─────────────────────────────┐
   │  3.0 Model Inference        │
   │  • Load model               │
   │  • Forward pass             │
   │  • Get predictions          │
   │  • Calculate confidence     │
   └────────┬────────────────────┘
            │ Predictions
            ▼
   ┌─────────────────────────────┐
   │  4.0 Format Response        │
   │  • Extract class name       │
   │  • Calculate confidence %   │
   │  • Create JSON response     │
   └────────┬────────────────────┘
            │ JSON Response
            ▼
  ┌──────────────────────┐
  │ Return to Frontend   │
  └──────────────────────┘
```

### 5.3 Use Case Diagram

```
                          ┌──────────────────────┐
                          │    Potato Disease    │
                          │  Classification      │
                          │      System          │
                          └──────────────────────┘
                                   △
                        ┌──────────┼──────────┐
                        │          │          │
                        │          │          │
                  ┌─────────┐  ┌────────┐  ┌────────────┐
                  │ Upload  │  │Display │  │   Clear    │
                  │ Image   │  │Results │  │   Data     │
                  └─────────┘  └────────┘  └────────────┘
                        │          │          │
                        │          │          │
                        └──────────┼──────────┘
                                   △
                                   │
                            ┌──────┴──────┐
                            │  Pengguna   │
                            │  (Petani)   │
                            └─────────────┘

Aktor: Pengguna / Petani

Use Cases:
1. Upload Image
   - Pengguna memilih file gambar
   - Sistem validasi format
   - Image di-preview
   
2. Display Results
   - Sistem menampilkan hasil prediksi
   - Menampilkan nama penyakit
   - Menampilkan confidence score
   
3. Clear Data
   - Pengguna menghapus data
   - Reset untuk prediksi baru
```

### 5.4 Class Diagram (Backend - Simplified)

```
┌─────────────────────────────────────┐
│        ImageProcessor               │
├─────────────────────────────────────┤
│ - IMAGE_SIZE: (224, 224)            │
│ - MODEL_PATH: str                   │
│ - CLASS_NAMES: list[str]            │
├─────────────────────────────────────┤
│ + read_file_as_image(data)          │
│ + validate_image(file)              │
│ + preprocess_image(image)           │
└─────────────────────────────────────┘
              △
              │ uses
              │
┌─────────────────────────────────────┐
│         PredictionEngine             │
├─────────────────────────────────────┤
│ - model: tf.keras.Model             │
│ - processor: ImageProcessor         │
├─────────────────────────────────────┤
│ + load_model(): void                │
│ + predict(image_array): dict        │
│ + get_confidence(): float           │
│ + get_class_name(): str             │
└─────────────────────────────────────┘
              △
              │ uses
              │
┌─────────────────────────────────────┐
│      FastAPI Application            │
├─────────────────────────────────────┤
│ - app: FastAPI                      │
│ - engine: PredictionEngine          │
├─────────────────────────────────────┤
│ + ping(): str                       │
│ + predict(file): dict               │
│ + add_cors_middleware(): void       │
└─────────────────────────────────────┘
```

### 5.5 Entity Relationship Diagram (Simplified)

```
┌──────────────────────────────┐
│      PredictionResult        │
├──────────────────────────────┤
│ - id: int (PK)               │
│ - timestamp: datetime        │
│ - user_id: int (FK)          │
│ - disease_class: string      │
│ - confidence: float          │
│ - image_path: string         │
└──────────────────────────────┘
         △                 △
         │                 │
    FK   │                 │ FK
         │                 │
┌──────────────────────────────┐    ┌──────────────────────────────┐
│      User                    │    │    DiseaseClass              │
├──────────────────────────────┤    ├──────────────────────────────┤
│ - id: int (PK)               │    │ - id: int (PK)               │
│ - username: string           │    │ - name: string               │
│ - email: string              │    │ - description: text          │
│ - created_at: datetime       │    │ - treatment: text            │
└──────────────────────────────┘    └──────────────────────────────┘

Current Implementation: Single table (no DB used in basic version)
Future: Implement for logging & analytics
```

---

## 6. PERANCANGAN DATABASE

### 6.1 Deskripsi Database

**Status**: Sistem saat ini menggunakan in-memory processing tanpa database persistensi.

**Untuk Production/Future Implementation**:

### 6.2 Skema Database

```sql
-- Tabel User
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    phone VARCHAR(20),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabel Disease Classification
CREATE TABLE disease_classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    treatment VARCHAR(1000),
    prevention VARCHAR(1000),
    severity_level VARCHAR(20), -- LOW, MEDIUM, HIGH
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Prediction Results
CREATE TABLE predictions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    disease_id INT NOT NULL,
    confidence FLOAT NOT NULL,
    image_path VARCHAR(255),
    image_hash VARCHAR(64),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    prediction_time FLOAT, -- milliseconds
    model_version VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by INT, -- user_id yang verify
    verified_at TIMESTAMP NULL,
    feedback_correct BOOLEAN NULL, -- untuk accuracy tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (disease_id) REFERENCES disease_classes(id),
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Tabel Model Versions
CREATE TABLE model_versions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    version VARCHAR(50) NOT NULL UNIQUE,
    accuracy FLOAT,
    precision FLOAT,
    recall FLOAT,
    f1_score FLOAT,
    total_parameters INT,
    training_dataset_size INT,
    training_epochs INT,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deployment_date TIMESTAMP NULL
);

-- Tabel Feedback
CREATE TABLE feedbacks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    prediction_id INT NOT NULL,
    is_correct BOOLEAN,
    feedback_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (prediction_id) REFERENCES predictions(id)
);
```

### 6.3 Index Strategy

```sql
-- Performance Indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_created ON users(created_at);
CREATE INDEX idx_prediction_user ON predictions(user_id);
CREATE INDEX idx_prediction_disease ON predictions(disease_id);
CREATE INDEX idx_prediction_date ON predictions(uploaded_at);
CREATE INDEX idx_prediction_confidence ON predictions(confidence);
CREATE INDEX idx_feedback_user ON feedbacks(user_id);
CREATE INDEX idx_feedback_prediction ON feedbacks(prediction_id);
```

### 6.4 Data Dictionary

| Tabel | Kolom | Tipe | Deskripsi |
|-------|-------|------|-----------|
| users | id | INT | Primary key |
| users | username | VARCHAR(100) | Nama pengguna unik |
| users | email | VARCHAR(100) | Email unik untuk login |
| disease_classes | id | INT | Primary key penyakit |
| disease_classes | name | VARCHAR(100) | Nama penyakit (7 jenis) |
| predictions | id | INT | Primary key prediksi |
| predictions | user_id | INT | Foreign key ke users |
| predictions | confidence | FLOAT | Skor kepercayaan (0-1) |
| predictions | uploaded_at | TIMESTAMP | Waktu upload gambar |
| model_versions | version | VARCHAR(50) | Versi model (e.g., v1.0.0) |
| model_versions | accuracy | FLOAT | Akurasi model pada test set |

---

## 7. PERANCANGAN ANTARMUKA (UI/UX)

### 7.1 Wireframe Aplikasi Frontend

```
┌─────────────────────────────────────────────────┐
│  Potato Disease Classifier System               │ [Header - Green]
│  🥔 Sistem Klasifikasi Penyakit Kentang         │
├─────────────────────────────────────────────────┤
│                                                 │
│                    [BACKGROUND IMAGE]           │
│                                                 │
│         ┌──────────────────────────────┐       │
│         │   Upload Image Here           │       │
│         │   📤 Click or Drag & Drop     │       │
│         │                              │       │
│         │   ┌─────────────────────┐    │       │
│         │   │  [Preview Image]    │    │       │
│         │   │  (if uploaded)      │    │       │
│         │   └─────────────────────┘    │       │
│         │                              │       │
│         └──────────────────────────────┘       │
│                                                 │
│  ┌────────────────────────────────────────┐   │
│  │ Results:                               │   │
│  │ ┌────────────────────────────────────┐ │   │
│  │ │ Disease: Black Scurf               │ │   │
│  │ │ Confidence: 95.67%                 │ │   │
│  │ └────────────────────────────────────┘ │   │
│  │                                        │   │
│  │ [CLEAR] [MORE INFO]                   │   │
│  └────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 7.2 Layout Komponen-Komponen UI

#### 7.2.1 Header Component
```
┌─────────────────────────────────────────────┐
│  Logo    │  Potato Disease Classifier       │
│  🥔      │  Sistem Klasifikasi Penyakit     │  [Green]
│          │  Kentang (PCD)                   │
└─────────────────────────────────────────────┘
```

#### 7.2.2 Upload Area Component
```
┌──────────────────────────────────────┐
│  DROP HERE TO UPLOAD IMAGES          │
│  or click to select files             │
│  Supported: PNG, JPG, JPEG            │
└──────────────────────────────────────┘
```

#### 7.2.3 Preview Component
```
┌────────────────┐
│                │
│   Gambar       │  Height: 400px
│   Preview      │  Max Width: 400px
│                │
└────────────────┘
```

#### 7.2.4 Results Component
```
┌─────────────────────────────────┐
│ HASIL PREDIKSI                   │
├─────────────────────────────────┤
│ Penyakit: Black Scurf            │ [Font: 22px, Bold]
│ Kepercayaan: 95.67%              │ [Font: 22px, Bold]
│                                 │
│ [Penjelasan Penyakit]            │ [Font: 14px]
│ Black Scurf adalah penyakit...  │
│                                 │
│ [CLEAR]  [SAVE REPORT]           │ [Buttons]
└─────────────────────────────────┘
```

### 7.3 User Flow Diagram

```
START
  │
  ├─→ User membuka aplikasi
  │
  ├─→ Melihat upload area
  │
  ├─→ Pilih/drag gambar
  │     ├─ Format valid? 
  │     │  └─ NO: Show error
  │     │  └─ YES: Continue
  │     │
  │
  ├─→ Preview ditampilkan
  │
  ├─→ Loading indicator
  │
  ├─→ Hasil prediksi ditampilkan
  │     ├─ Disease name
  │     ├─ Confidence %
  │     └─ Disease info
  │
  ├─→ User dapat:
  │     ├─ Clear → Kembali ke upload
  │     ├─ Save report
  │     └─ Upload lagi
  │
  END
```

### 7.4 Warna dan Styling

**Color Palette:**
```
Primary Color:    #098f26 (Hijau - untuk header, buttons)
Secondary Color:  #ffffff (Putih - untuk konten)
Background:       Foto pertanian (gradient hijau)
Text Color:       #000000a6 (Hitam transparan)
Accent Color:     #038c33 (Hijau gelap - untuk hover)
Success Color:    #4caf50 (Hijau - untuk hasil positif)
Error Color:      #f44336 (Merah - untuk error)
```

**Typography:**
```
Header:      Font Size: 24px, Font Weight: Bold
Title:       Font Size: 22px, Font Weight: 900
Body:        Font Size: 16px
Label:       Font Size: 14px
Button:      Font Size: 16px, Font Weight: Bold
```

### 7.5 Responsive Design

```
Desktop (>960px):
┌──────────────────────────────────┐
│  Header                          │
├──────────────────────────────────┤
│                                  │
│  [Upload Area]  [Results Area]   │
│  50% width      50% width        │
│                                  │
└──────────────────────────────────┘

Tablet (600px-960px):
┌──────────────────────┐
│  Header              │
├──────────────────────┤
│  [Upload Area]       │
│  ├──────────────────┤
│  [Results Area]      │
│  └──────────────────┘
│ 100% width          │
└──────────────────────┘

Mobile (<600px):
┌──────────┐
│ Header   │
├──────────┤
│[Upload]  │
│[Results] │
│100% width│
└──────────┘
```

### 7.6 Material-UI Components Digunakan

```
1. AppBar
   - Fungsi: Header dengan branding
   - Props: position="fixed", color="primary"

2. Card
   - Fungsi: Container untuk upload dan results
   - Props: elevation, borderRadius

3. Grid
   - Fungsi: Layout responsive
   - Props: container, item, xs, sm, md, lg

4. Button
   - Fungsi: Upload, Clear, Action buttons
   - Variants: contained, outlined

5. CircularProgress
   - Fungsi: Loading indicator
   - Props: size, color

6. Table
   - Fungsi: Display hasil dengan tabel
   - Components: TableHead, TableRow, TableCell

7. DropzoneArea
   - Fungsi: Upload area dengan drag & drop
   - Props: acceptedFiles, filesLimit, dropzoneText
```

---

## 8. INTEGRASI SISTEM

### 8.1 API Integration

**Base URL**: `http://localhost:8000`

**Endpoint 1: Health Check**
```
GET /ping
Response: "Hello, I am alive"
Status: 200
```

**Endpoint 2: Prediction**
```
POST /predict
Content-Type: multipart/form-data
Body: {
  "file": <binary image data>
}

Response (200):
{
  "class": "Black Scurf",
  "confidence": 0.9567
}

Response (400):
{
  "detail": "File must be an image"
}

Response (500):
{
  "detail": "Prediction error: ..."
}
```

### 8.2 Error Handling

```
Frontend Error Handling:
- Network error → Show "Connection failed"
- Invalid file type → Show "Please upload an image"
- API 500 error → Show "Server error, try again"

Backend Error Handling:
- Invalid MIME type → HTTPException(400)
- Image processing error → HTTPException(400)
- Model loading error → HTTPException(500)
- Prediction error → HTTPException(500)
```

---

## 9. KEAMANAN SISTEM

### 9.1 Security Measures

```
1. CORS Protection
   - Only allow localhost:3000
   - Prevent cross-origin attacks

2. File Validation
   - Check MIME type (image/* only)
   - Reject non-image files

3. Input Validation
   - Image size limits
   - Safe file processing

4. Error Messages
   - Tidak expose internal errors
   - Generic error messages untuk user

5. Model Security
   - Load model dari trusted path
   - Version control untuk model
```

### 9.2 Future Security Improvements

```
1. Authentication
   - User login system
   - JWT tokens

2. Authorization
   - Role-based access control
   - API rate limiting

3. Data Protection
   - Encrypt stored images
   - Secure database connection

4. Logging & Monitoring
   - API request logging
   - Error tracking
   - Model prediction logging
```

---

## 10. DEPLOYMENT ARCHITECTURE

### 10.1 Development Environment

```
├── Frontend (Port 3000)
│   └─ npm start
│   └─ React dev server
│
├── Backend (Port 8000)
│   └─ python main.py
│   └─ FastAPI + Uvicorn
│
└── Model
    └─ saved_model/final/
```

### 10.2 Production Deployment (Recommended)

```
┌─────────────────────────────────────┐
│        PRODUCTION SERVER            │
├─────────────────────────────────────┤
│                                     │
│  ┌────────────────────────────┐    │
│  │  Nginx (Reverse Proxy)     │    │
│  │  • Port 80, 443            │    │
│  │  • Load balancing          │    │
│  │  • SSL/TLS                 │    │
│  └────────────────┬───────────┘    │
│                   │                │
│    ┌──────────────┴──────────────┐ │
│    │                             │ │
│  ┌─▼──────────────┐  ┌──────────▼─┐
│  │ Frontend       │  │ Backend    │
│  │ (Node.js)      │  │ (Uvicorn) │
│  │ Build static   │  │ Multiple  │
│  │ Serve CSS/JS   │  │ workers   │
│  └────────────────┘  └────────────┘
│                             │
│                    ┌────────▼────────┐
│                    │ ML Model        │
│                    │ saved_model/    │
│                    │ (GPU Memory)    │
│                    └─────────────────┘
│
└─────────────────────────────────────┘
```

---

## 11. PERFORMANCE & SCALABILITY

### 11.1 Performance Targets

```
Metric                Target      Current
────────────────────────────────────────
Inference Time        < 2s        ~1-1.5s
API Response Time     < 2.5s      ~1-2s
Model Load Time       < 5s        ~2-3s
Frontend Load Time    < 3s        ~1-2s
Accuracy             > 90%       ~92%
```

### 11.2 Scalability Considerations

```
1. Model Serving
   - Use TFServing untuk multiple models
   - GPU acceleration
   - Model caching

2. API Scaling
   - Uvicorn with multiple workers
   - Load balancing
   - Connection pooling

3. Frontend
   - CDN untuk static assets
   - Compression
   - Caching

4. Database (Future)
   - Read replicas
   - Connection pooling
   - Query optimization
```

---

## 12. TESTING STRATEGY

### 12.1 Unit Testing

```python
# Test image preprocessing
def test_read_file_as_image():
    - Test valid image processing
    - Test RGB conversion
    - Test resizing

# Test prediction
def test_predict():
    - Test model loading
    - Test inference
    - Test output format

# Test validation
def test_file_validation():
    - Test MIME type checking
    - Test invalid files
```

### 12.2 Integration Testing

```
- Frontend ↔ Backend integration
- API endpoint testing
- Model loading and inference
- End-to-end workflow testing
```

### 12.3 Performance Testing

```
- Load testing (concurrent requests)
- Stress testing (memory usage)
- Model inference performance
- Database query performance (Future)
```

---

## 13. MAINTENANCE & MONITORING

### 13.1 Monitoring Metrics

```
Backend:
- API response time
- Error rate
- CPU/Memory usage
- Model load time

Frontend:
- Page load time
- JavaScript errors
- User interactions

Model:
- Prediction accuracy
- Confidence distribution
- Inference time variation
```

### 13.2 Logs & Debugging

```
Log Levels:
- DEBUG: Development information
- INFO: System operations
- WARNING: Warnings
- ERROR: Error conditions
- CRITICAL: Critical failures

Log Locations:
- Backend: logs/api/
- Frontend: Browser console
- Model: logs/model/
```

---

## 14. RINGKASAN METODOLOGI

| Aspek | Teknologi | Deskripsi |
|-------|-----------|-----------|
| **Framework ML** | TensorFlow/Keras | Deep learning dengan transfer learning |
| **Model Base** | EfficientNetV2B0 | Pre-trained on ImageNet |
| **Backend** | FastAPI | REST API dengan Uvicorn |
| **Frontend** | React + Material-UI | Web interface responsif |
| **Deployment** | Docker/Nginx | Production-ready setup |
| **Database** | MySQL (Future) | For logging & analytics |
| **Testing** | pytest + Jest | Unit & integration testing |

---

**Dokumen ini adalah bagian dari Laporan Proyek Akhir Sistem Klasifikasi Penyakit Potato**

