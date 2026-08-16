# AI-Based Agricultural Monitoring System

A hierarchical AI-based agricultural monitoring system for tomato cultivation. The system combines computer vision, environmental and soil sensing, agricultural knowledge, Retrieval-Augmented Generation (RAG), and a Large Language Model (LLM) to progress from plant-level detection to disease/pest identification and contextual agricultural reporting.

> **Current status:** Four specialized AI/ML models have been developed and evaluated. Prototype development, project-specific data collection, final fine-tuning/retraining, the Decision/Context Layer, and Gemini integration are planned future stages.

## 1. System Architecture

```text
                         CAMERA
                            |
                            v
                +-----------------------+
                |       MODEL 1         |
                |       YOLO26s         |
                | Tomato Plant / Weed   |
                +-----------+-----------+
                            |
                 +----------+----------+
                 |                     |
               WEED              TOMATO PLANT
                 |                     |
                 v                     v
        +----------------+       Targeted/close-up
        |    MODEL 2     |              |
        |    YOLO26s     |              v
        | Tomato Leaf +  |      +----------------+
        | Weed Species   |      |    MODEL 2     |
        | Detection      |      |  Tomato Leaf   |
        +--------+-------+      |   Detection    |
                 |              +-------+--------+
                 |                      |
                 +----------+-----------+
                            |
                  +---------+---------+
                  |                   |
                  v                   v
          +-------------+     +-------------+
          |   MODEL 3   |     |   MODEL 4   |
          | EfficientNet|     | EfficientNet|
          |    -B2      |     |    -B2      |
          |   Disease   |     |     Pest    |
          |Classification|    |Classification|
          +------+------+     +------+------+
                 |                   |
                 +---------+---------+
                           |
                           v
              +---------------------------+
              |   DECISION / CONTEXT      |
              |          LAYER            |
              |                           |
              | Agricultural Rules        |
              | Knowledge Base            |
              | RAG                       |
              | Climate Data              |
              | Soil / NPK Data           |
              | IoT Sensor Data           |
              +-------------+-------------+
                            |
                            v
                   +----------------+
                   | GOOGLE GEMINI   |
                   |      LLM        |
                   | Reasoning +     |
                   | Report Generation|
                   +-------+---------+
                           |
                           v
              +-------------------------+
              |   AGRICULTURAL REPORT   |
              | Crop Health             |
              | Disease / Pest Status   |
              | Weed Status             |
              | Soil Condition          |
              | Environmental Risk      |
              | Recommendations         |
              +-------------------------+
```

## 2. AI/ML Models

### Model 1 — Tomato Plant + Weed Detection

**Architecture:** YOLO26s  
**Task:** Two-class object detection

```text
0 = tomato_plant
1 = weed
```

Model 1 performs scene-level detection and identifies tomato plants and weeds using bounding boxes. It is the first stage of the hierarchical computer-vision pipeline.

#### Dataset

The final Model 1 dataset was constructed by combining:

- Tomato Plant Detection — Roboflow Version 6
- Weed Detection — Roboflow Version 11

The weed classes were consolidated into a single `weed` class because Model 1 only needs to distinguish tomato plants from weeds.

#### Final Dataset

```text
Total images        : 13,535
Total bounding boxes: 15,367
Tomato plant boxes  : 9,523
Weed boxes          : 5,844
```

#### Split

| Split | Images | Bounding Boxes |
|---|---:|---:|
| Train | 10,790 | 11,928 |
| Validation | 1,391 | 1,762 |
| Test | 1,354 | 1,677 |

The final dataset check confirmed no missing labels, orphan labels, malformed annotations, invalid classes, invalid boxes, or duplicate image content across splits. There was one empty training label remaining.

#### Training

- Architecture: YOLO26s
- Image size: 640 × 640
- Maximum epochs: 100
- Early stopping: enabled
- Best epoch: 59
- Training stopped at epoch 79

#### Final Validation Performance

| Metric | Overall |
|---|---:|
| Precision | **94.3%** |
| Recall | **91.1%** |
| mAP@50 | **94.3%** |
| mAP@50–95 | **66.0%** |

#### Per-Class Performance

| Class | Precision | Recall | mAP@50 | mAP@50–95 |
|---|---:|---:|---:|---:|
| Tomato Plant | 95.8% | 93.5% | 95.4% | 62.8% |
| Weed | 92.9% | 88.6% | 93.2% | 69.2% |

#### Model Details

```text
Parameters : 9,465,954
GFLOPs     : 20.8
Best epoch : 59
Inference  : ~3.6 ms/image
```

These are validation results from the best checkpoint. The held-out test split should be used for the final generalization evaluation.

---

### Model 2 — Tomato Leaf + Weed Species Detection

**Architecture:** YOLO26s  
**Task:** Multi-class object detection

Model 2 performs fine-grained detection after the broader plant/weed stage. It detects tomato leaves and individual weed species.

#### Classes

```text
0  = tomato_leaf
1  = amaranthus_palmeri
2  = amaranthus_tuberculatus
3  = ambrosia_artemisiifolia
4  = eclipta
5  = eleusine_indica
6  = euphorbia_maculata
7  = ipomoea_indica
8  = mollugo_verticillata
9  = physalis_angulata
10 = portulaca_oleracea
11 = senna_obtusifolia
12 = sida_rhombifolia
```

#### Dataset

The model uses the merged tomato-leaf detection data and the Weed Detection dataset used for the weed-species classes. The project dataset was prepared specifically for this 13-class detection task.

#### Test Performance

| Metric | Performance |
|---|---:|
| Precision | **89.63%** |
| Recall | **81.27%** |
| mAP@50 | **87.11%** |
| mAP@50–95 | **66.64%** |

Model 2 provides the fine-grained detection stage needed to identify tomato leaves and distinguish individual weed species.

---

### Model 3 — Tomato Disease Classification

**Architecture:** EfficientNet-B2  
**Task:** Multi-class tomato disease classification

The intended pipeline is:

```text
Tomato plant
     ↓
Tomato leaf localization
     ↓
Leaf image / crop
     ↓
EfficientNet-B2
     ↓
Disease class
```

#### Current Evaluation

| Metric | Performance |
|---|---:|
| Validation Accuracy | **99.67%** |
| TTA Accuracy | **99.75%** |
| Precision | **99.67%** |
| Recall | **99.67%** |
| F1-score | **99.67%** |

TTA refers to Test-Time Augmentation.

These are current dataset-level evaluation results. They should not be interpreted as guaranteed field accuracy. Further fine-tuning and validation under real operating conditions are planned.

---

### Model 4 — Tomato Pest Classification

**Architecture:** EfficientNet-B2  
**Task:** Multi-class tomato pest classification

The intended pipeline is:

```text
Tomato plant / leaf image
          ↓
Relevant image region
          ↓
EfficientNet-B2
          ↓
Pest class
```

#### Current Evaluation

| Metric | Performance |
|---|---:|
| Accuracy | **89.13%** |
| Macro Precision | **90.75%** |
| Macro Recall | **87.47%** |
| Macro F1 | **88.54%** |
| Weighted Precision | **89.51%** |
| Weighted Recall | **89.13%** |
| Weighted F1 | **89.00%** |

These are the current evaluation results of the developed pest-classification model.

---

## 3. Combined Model Performance

| Model | Task | Architecture | Current Performance |
|---|---|---|---|
| Model 1 | Tomato plant + weed detection | YOLO26s | P: **94.3%**, R: **91.1%**, mAP50: **94.3%**, mAP50-95: **66.0%** |
| Model 2 | Tomato leaf + weed species detection | YOLO26s | P: **89.63%**, R: **81.27%**, mAP50: **87.11%**, mAP50-95: **66.64%** |
| Model 3 | Tomato disease classification | EfficientNet-B2 | Accuracy: **99.67%**, TTA: **99.75%**, F1: **99.67%** |
| Model 4 | Tomato pest classification | EfficientNet-B2 | Accuracy: **89.13%**, Macro F1: **88.54%** |

The metrics are not directly comparable across all four models because Models 1 and 2 are object-detection models, while Models 3 and 4 are classification models.

## 4. Hierarchical Inference Pipeline

The four models are designed to work together rather than as four independent classifiers.

### Stage 1 — Scene-level detection

Model 1 determines:

- Whether a tomato plant is present
- Whether weeds are present
- Where the detected objects are located

### Stage 2 — Fine-grained detection

Model 2 determines:

- Whether a relevant tomato leaf is present
- Which weed species is present
- Where the relevant leaf/weed region is located

### Stage 3 — Disease analysis

A detected tomato leaf can be passed to Model 3:

```text
Tomato Leaf
    ↓
EfficientNet-B2
    ↓
Disease Prediction
```

### Stage 4 — Pest analysis

Relevant plant/leaf imagery can be passed to Model 4:

```text
Tomato Plant / Leaf
        ↓
EfficientNet-B2
        ↓
Pest Prediction
```

The hierarchical design progressively moves from broad scene understanding to fine-grained disease and pest analysis.

## 5. Planned Decision / Context Layer

After Models 1–4 are integrated, a **Decision/Context Layer** will be developed.

It will combine AI outputs with:

- Agricultural rules
- Agricultural knowledge base
- Retrieval-Augmented Generation (RAG)
- Climate data
- Soil NPK measurements
- Soil moisture
- Soil pH
- Temperature
- Humidity
- Rainfall
- Other IoT/sensor measurements

Example structured input:

```text
Model 1:
Tomato plant detected
Weed detected

Model 2:
Tomato leaf detected
Weed species = ...

Model 3:
Disease = ...
Confidence = ...

Model 4:
Pest = ...
Confidence = ...

Sensors:
Temperature = ...
Humidity = ...
Soil moisture = ...
NPK = ...
```

The layer will organize these observations and retrieve relevant agricultural evidence before passing structured context to the LLM.

**This layer is planned future development and is not currently implemented.**

## 6. Planned Google Gemini LLM Layer

The final reporting layer will use **Google Gemini**.

Gemini will receive:

```text
Model 1 outputs
      +
Model 2 outputs
      +
Model 3 outputs
      +
Model 4 outputs
      +
Climate information
      +
Soil / NPK information
      +
IoT sensor data
      +
Decision / Context Layer
      +
Retrieved agricultural evidence
```

The final report may contain:

- Overall crop health
- Tomato plant status
- Weed status and species
- Disease status
- Pest status
- Soil condition
- Environmental conditions
- Risk assessment
- Priority observations
- Context-supported recommendations

### Architectural Principle

Gemini will **not replace the specialized ML models**.

```text
Models 1–4
    ↓
Visual perception and classification

Decision / Context Layer
    ↓
Agricultural context and evidence

Google Gemini
    ↓
Reasoning + synthesis + natural-language reporting
```

The Gemini integration is planned future development.

## 7. Prototype Data Collection

The current models were developed using existing datasets. After prototype development, project-specific data will be collected from the actual target environment.

Planned data includes:

- Tomato plant images
- Tomato leaf images
- Weed images
- Weed species
- Healthy leaves
- Disease-affected leaves
- Pest images
- Different lighting conditions
- Different camera distances
- Different viewpoints
- Different crop growth stages
- Environmental variations
- Sensor measurements

The collected data will be cleaned, annotated, quality-checked, and incorporated into the training pipeline.

## 8. Fine-Tuning and Final Retraining

The four current models represent the initial AI development stage.

After prototype development and field testing:

1. Project-specific data will be collected.
2. Data will be cleaned and annotated.
3. Quality control will be performed.
4. Existing datasets and project-specific data will be combined.
5. Models 1–4 will be fine-tuned or retrained.
6. A separate project-specific test set will be maintained.
7. Final evaluation will be performed on previously unseen real-world data.

The objective is to reduce the **domain gap** between existing datasets and the actual prototype environment.

Final system performance will therefore be established using project-specific real-world data rather than assuming that current dataset-level metrics represent field performance.

## 9. Development Roadmap

```text
CURRENT
Four specialized AI models developed and evaluated
        ↓
PHASE 1
Fine-tune and optimize Models 1–4
        ↓
PHASE 2
Develop and deploy prototype
        ↓
PHASE 3
Collect real-world field + sensor data
        ↓
PHASE 4
Combine existing + project-specific datasets
        ↓
PHASE 5
Retrain / fine-tune Models 1–4
        ↓
PHASE 6
Integrate Models 1–4 into complete inference pipeline
        ↓
PHASE 7
Develop Decision / Context Layer
        ↓
    Agricultural Rules
    Knowledge Base
    RAG
    Climate Data
    Soil / NPK
    IoT Sensors
        ↓
PHASE 8
Integrate Google Gemini
        ↓
PHASE 9
End-to-end real-world evaluation
```

## 10. Future Scope

### Real-world model adaptation

Project-specific field data can adapt the models to local agricultural conditions, tomato varieties, weed populations, pest populations, actual camera characteristics, lighting conditions, backgrounds, and crop growth stages.

### Continuous dataset expansion

```text
Prototype
    ↓
Field Data
    ↓
Annotation
    ↓
Quality Control
    ↓
Dataset Expansion
    ↓
Fine-Tuning
    ↓
Evaluation
    ↓
Improved Model
```

### Sensor fusion

Visual predictions can be combined with soil moisture, NPK, pH, temperature, humidity, rainfall, and other environmental measurements.

### Agricultural RAG

A future knowledge base can contain verified agricultural resources covering tomato diseases, tomato pests, weed management, soil management, nutrient requirements, irrigation, environmental risk factors, and crop-management practices.

### LLM-based agricultural reporting

The final system is intended to transform independent AI predictions and sensor observations into a structured agricultural report rather than presenting isolated predictions.

### Prototype deployment

The final system can eventually be deployed on a mobile, robotic, or other field-deployed platform capable of acquiring images and sensor measurements.

```text
Camera
   ↓
Real-time inference
   ↓
Plant / weed detection
   ↓
Targeted close-up
   ↓
Leaf / disease / pest analysis
   ↓
Sensor fusion
   ↓
Decision / Context Layer
   ↓
Gemini
   ↓
Agricultural Report
```

## 11. Current vs Future Components

| Component | Status |
|---|---|
| Model 1 — YOLO26s | Developed and validated |
| Model 2 — YOLO26s | Developed and evaluated |
| Model 3 — EfficientNet-B2 | Developed and evaluated |
| Model 4 — EfficientNet-B2 | Developed and evaluated |
| Prototype | Planned |
| Project-specific field data collection | Planned |
| Final model fine-tuning | Planned |
| Project-specific retraining | Planned |
| Complete model integration | Planned |
| Agricultural rules | Planned |
| Agricultural knowledge base | Planned |
| RAG | Planned |
| IoT/sensor integration | Planned |
| Decision/Context Layer | Planned |
| Gemini integration | Planned |
| End-to-end evaluation | Planned |

## 12. Limitations of Current Results

The current results should not be interpreted as guaranteed real-world field performance.

Potential differences between existing datasets and the deployment environment include:

- Camera quality
- Lighting
- Background complexity
- Plant growth stage
- Leaf orientation
- Disease severity
- Pest size
- Environmental conditions
- Crop varieties
- Weed populations

Project-specific field data collection, fine-tuning, retraining, and final end-to-end evaluation are therefore essential before claiming deployment-level performance.

## 13. Final Objective

The final objective is an integrated agricultural monitoring and decision-support system that progresses from **visual observation to contextual agricultural reporting**.

```text
Detect
  ↓
Identify
  ↓
Classify
  ↓
Combine with environmental data
  ↓
Retrieve agricultural context
  ↓
Reason over combined evidence
  ↓
Generate agricultural report
  ↓
Support farmer decision-making
```

The system combines:

- Computer Vision
- Object Detection
- Deep Learning
- Image Classification
- IoT/Sensor Data
- Agricultural Rules
- Agricultural Knowledge Base
- Retrieval-Augmented Generation
- Large Language Model reasoning

The specialized ML models remain responsible for visual perception, while the future Decision/Context Layer and Gemini layer provide contextual synthesis and natural-language reporting.
