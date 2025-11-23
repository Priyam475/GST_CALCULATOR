# GST Calculator with AI Forecast 🚀

A modern, feature-rich GST (Goods and Services Tax) calculator built with vanilla web technologies. This application goes beyond simple calculations by integrating a stunning 3D interactive background and a client-side AI model to predict future price trends.

![GST Calculator Preview](https://via.placeholder.com/800x400?text=GST+Calculator+Preview)

## ✨ Key Features

### 🧮 Advanced GST Calculation
- **Flexible Modes**: Calculate **GST Exclusive** (add tax) and **GST Inclusive** (extract tax) amounts.
- **Tax Breakdown**: Detailed split for **Intra-State** (CGST + SGST) and **Inter-State** (IGST) transactions.
- **Smart Inputs**: Quick-select buttons for standard rates (5%, 12%, 18%, 28%) and a custom rate input field.
- **Productivity**: One-click **Copy to Clipboard** for results and a persistent **Calculation History** sidebar.

### 🤖 AI Price Forecast
- **TensorFlow.js Integration**: Runs a lightweight neural network directly in your browser.
- **Predictive Analysis**: Forecasts future prices based on product categories (Electronics, Essentials, Luxury) and timeframes (1-5 years).
- **Insights**: Provides estimated inflation impact, future price, and GST rate outlook with a confidence score.

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Sleek, semi-transparent cards with a frosted glass effect.
- **3D Background**: Interactive particle system powered by **Three.js** that reacts to mouse movement.
- **Responsive**: Fully optimized for desktop, tablet, and mobile devices.

## 🛠️ Technologies Used

- **Core**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: [Three.js](https://threejs.org/) (via CDN)
- **Machine Learning**: [TensorFlow.js](https://www.tensorflow.org/js) (via CDN)
- **Typography**: [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)

## 🚀 Getting Started

### Prerequisites
You need a modern web browser (Chrome, Firefox, Edge, Safari).

### Installation & Running
1.  **Clone the repository** (or download the files):
    ```bash
    git clone <repository-url>
    cd gst-calculator
    ```

2.  **Run a local server**:
    Because the project uses modern web features and external libraries, it's best run on a local server.
    
    If you have Node.js installed, you can use `http-server`:
    ```bash
    npx http-server . -p 8080
    ```
    *Alternatively, you can use the "Live Server" extension in VS Code.*

3.  **Open the App**:
    Visit `http://localhost:8080` in your browser.

## 📂 Project Structure

```
gst-calculator/
├── index.html      # Main application structure and layout
├── style.css       # Styling, animations, and responsive design
├── script.js       # Logic for calculator, AI model, and 3D background
└── README.md       # Project documentation
```

## 🔮 Future Improvements
- [ ] Add export to PDF/Excel feature for history.
- [ ] Train the AI model on real-time economic data APIs.
- [ ] Add dark/light mode toggle.

---
*Built with ❤️ by Antigravity*
