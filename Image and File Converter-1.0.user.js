// ==UserScript==
// @name         Image and File Converter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A web-based file converter that allows users to drag and drop files and select formats.
// @author       Scody
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Языковые настройки
    const languages = {
        en: {
            title: "File Converter",
            dropAreaText: "Drag & drop your file here or click to upload",
            selectInputFormat: "Select input format",
            selectOutputFormat: "Select output format",
            convertedImageText: "Converted Image:",
            download: "Download",
            alertSelectFile: "Please select a file.",
            progressStart: "Conversion started...",
            converting: "Converting... {progress}%",
            conversionComplete: "Conversion complete!",
            toggle: "Toggle Converter",
        },
        ru: {
            title: "Конвертер файлов",
            dropAreaText: "Перетащите файл сюда или нажмите, чтобы загрузить",
            selectInputFormat: "Выберите формат входного файла",
            selectOutputFormat: "Выберите формат выходного файла",
            convertedImageText: "Сконвертированное изображение:",
            download: "Скачать",
            alertSelectFile: "Пожалуйста, выберите файл.",
            progressStart: "Конвертация началась...",
            converting: "Конвертация... {progress}%",
            conversionComplete: "Конвертация завершена!",
            toggle: "Свернуть конвертер",
        },
        zh: {
            title: "文件转换器",
            dropAreaText: "将文件拖放到此处或单击以上传",
            selectInputFormat: "选择输入格式",
            selectOutputFormat: "选择输出格式",
            convertedImageText: "已转换的图像:",
            download: "下载",
            alertSelectFile: "请选择一个文件。",
            progressStart: "转换开始...",
            converting: "转换中... {progress}%",
            conversionComplete: "转换完成！",
            toggle: "切换转换器",
        },
        fr: {
            title: "Convertisseur de fichiers",
            dropAreaText: "Faites glisser et déposez votre fichier ici ou cliquez pour télécharger",
            selectInputFormat: "Sélectionnez le format d'entrée",
            selectOutputFormat: "Sélectionnez le format de sortie",
            convertedImageText: "Image convertie :",
            download: "Télécharger",
            alertSelectFile: "Veuillez sélectionner un fichier.",
            progressStart: "Conversion commencée...",
            converting: "Conversion... {progress}%",
            conversionComplete: "Conversion terminée !",
            toggle: "Basculer le convertisseur",
        },
        ja: {
            title: "ファイルコンバータ",
            dropAreaText: "ここにファイルをドラッグ＆ドロップするか、クリックしてアップロード",
            selectInputFormat: "入力フォーマットを選択",
            selectOutputFormat: "出力フォーマットを選択",
            convertedImageText: "変換された画像:",
            download: "ダウンロード",
            alertSelectFile: "ファイルを選択してください。",
            progressStart: "変換が開始されました...",
            converting: "変換中... {progress}%",
            conversionComplete: "変換が完了しました！",
            toggle: "コンバータを切り替える",
        },
        de: {
            title: "Dateikonverter",
            dropAreaText: "Ziehen Sie Ihre Datei hierher oder klicken Sie, um hochzuladen",
            selectInputFormat: "Eingabeformat auswählen",
            selectOutputFormat: "Ausgabeformat auswählen",
            convertedImageText: "Konvertiertes Bild:",
            download: "Herunterladen",
            alertSelectFile: "Bitte wählen Sie eine Datei aus.",
            progressStart: "Konvertierung gestartet...",
            converting: "Konvertieren... {progress}%",
            conversionComplete: "Konvertierung abgeschlossen!",
            toggle: "Konverter umschalten",
        },
        es: {
            title: "Convertidor de archivos",
            dropAreaText: "Arrastre y suelte su archivo aquí o haga clic para cargar",
            selectInputFormat: "Seleccione el formato de entrada",
            selectOutputFormat: "Seleccione el formato de salida",
            convertedImageText: "Imagen convertida:",
            download: "Descargar",
            alertSelectFile: "Por favor, seleccione un archivo.",
            progressStart: "Conversión iniciada...",
            converting: "Convirtiendo... {progress}%",
            conversionComplete: "¡Conversión completa!",
            toggle: "Alternar convertidor",
        },
        uk: {
            title: "Конвертер файлів",
            dropAreaText: "Перетягніть файл сюди або натисніть, щоб завантажити",
            selectInputFormat: "Виберіть вхідний формат",
            selectOutputFormat: "Виберіть вихідний формат",
            convertedImageText: "Перетворене зображення:",
            download: "Завантажити",
            alertSelectFile: "Будь ласка, виберіть файл.",
            progressStart: "Перетворення розпочато...",
            converting: "Перетворення... {progress}%",
            conversionComplete: "Перетворення завершено!",
            toggle: "Перемкнути конвертер",
        },
    };

    // Инициализация языка
    let lang = 'en'; // По умолчанию английский

    const guiContainer = document.createElement('div');
    guiContainer.id = 'file-converter';
    guiContainer.style = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 300px;
        background-color: rgba(255, 255, 255, 0.8);
        border: 1px solid #007BFF;
        border-radius: 10px;
        z-index: 10000;
        padding: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;

    guiContainer.innerHTML = `
        <h4 style="color: black;">${languages[lang].title}</h4>
        <div>
            <label for="language-select" style="color: black;">Select Language:</label>
            <select id="language-select" style="border: 1px solid #007BFF; border-radius: 5px; padding: 5px;">
                <option value="en">English (Англійська)</option>
                <option value="ru">Русский (Russian)</option>
                <option value="zh">中文 (Chinese)</option>
                <option value="fr">Français (French)</option>
                <option value="ja">日本語 (Japanese)</option>
                <option value="de">Deutsch (German)</option>
                <option value="es">Español (Spanish)</option>
                <option value="uk">Українська (Ukrainian)</option>
            </select>
        </div>
        <button id="toggle-button" style="background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer; width: 100%;">${languages[lang].toggle}</button>
        <div id="converter-content" style="display: none; margin-top: 10px;">
            <div id="drop-area" style="border: 2px dashed #007BFF; padding: 20px; text-align: center; color: black; cursor: pointer;">
                ${languages[lang].dropAreaText}
            </div>
            <input type="file" id="file-input" style="display: none;" />
            <div id="file-info" style="color: black;"></div>
            <div style="margin-top: 10px;">
                <label for="input-format" style="color: black;">${languages[lang].selectInputFormat}:</label>
                <select id="input-format" style="border: 1px solid #007BFF; border-radius: 5px; padding: 5px;">
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                    <option value="gif">GIF</option>
                    <option value="webp">WEBP</option>
                    <option value="bmp">BMP</option>
                    <option value="tiff">TIFF</option>
                    <option value="html">HTML</option>
                    <option value="htm">HTM</option>
                    <option value="svg">SVG</option>
                    <option value="pdf">PDF</option>
                </select>
            </div>
            <div style="margin-top: 10px;">
                <label for="output-format" style="color: black;">${languages[lang].selectOutputFormat}:</label>
                <select id="output-format" style="border: 1px solid #007BFF; border-radius: 5px; padding: 5px;">
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                    <option value="gif">GIF</option>
                    <option value="webp">WEBP</option>
                    <option value="bmp">BMP</option>
                    <option value="tiff">TIFF</option>
                    <option value="html">HTML</option>
                    <option value="htm">HTM</option>
                    <option value="svg">SVG</option>
                    <option value="pdf">PDF</option>
                </select>
            </div>
            <button id="convert-button" style="background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px; width: 100%;">Convert</button>
            <div id="progress-container" style="display: none; margin-top: 10px;">
                <div id="progress-text" style="color: black;"></div>
                <div id="progress-bar" style="border: 1px solid #007BFF; border-radius: 5px; height: 20px; overflow: hidden; background-color: #f3f3f3;">
                    <div id="progress-fill" style="width: 0; height: 100%; background-color: #007BFF;"></div>
                </div>
            </div>
            <div id="converted-image" style="display: none; margin-top: 10px; text-align: center;">
                <span style="color: black;">${languages[lang].convertedImageText}</span>
                <img id="output-image" src="" alt="Converted Image" style="max-width: 100%; margin-top: 5px;" />
                <a id="download-link" href="#" download style="display: none; margin-top: 10px; background-color: #007BFF; color: white; padding: 5px; border-radius: 5px; text-decoration: none;">${languages[lang].download}</a>
            </div>
        </div>
    `;

    document.body.appendChild(guiContainer);

    // Функция для обновления текста в зависимости от языка
    function updateLanguage() {
        const selectedLanguage = languages[lang];
        document.querySelector('h4').textContent = selectedLanguage.title;
        document.getElementById('drop-area').textContent = selectedLanguage.dropAreaText;
        document.getElementById('convert-button').textContent = "Convert";
        document.getElementById('progress-text').textContent = "";
        document.getElementById('download-link').textContent = selectedLanguage.download;
        document.getElementById('input-format').previousElementSibling.textContent = selectedLanguage.selectInputFormat + ":";
        document.getElementById('output-format').previousElementSibling.textContent = selectedLanguage.selectOutputFormat + ":";
        document.getElementById('toggle-button').textContent = selectedLanguage.toggle;
    }

    // Событие выбора языка
    document.getElementById('language-select').addEventListener('change', (event) => {
        lang = event.target.value;
        updateLanguage();
    });

    // Обработка перетаскивания файлов
    const dropArea = document.getElementById('drop-area');
    dropArea.addEventListener('click', () => document.getElementById('file-input').click());
    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.style.backgroundColor = '#e9e9e9';
    });
    dropArea.addEventListener('dragleave', () => {
        dropArea.style.backgroundColor = '';
    });
    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.style.backgroundColor = '';
        const files = event.dataTransfer.files;
        if (files.length) {
            document.getElementById('file-input').files = files;
            updateFileInfo(files[0]);
        }
    });

    // Обработка выбора файла
    document.getElementById('file-input').addEventListener('change', (event) => {
        const files = event.target.files;
        if (files.length) {
            updateFileInfo(files[0]);
        }
    });

    // Обновление информации о файле
    function updateFileInfo(file) {
        const fileInfo = document.getElementById('file-info');
        fileInfo.textContent = `Selected file: ${file.name} (${file.type})`;
    }

    // Обработка конвертации
    document.getElementById('convert-button').addEventListener('click', () => {
        const fileInput = document.getElementById('file-input');
        if (!fileInput.files.length) {
            alert(languages[lang].alertSelectFile);
            return;
        }
        const selectedFile = fileInput.files[0];
        const inputFormat = document.getElementById('input-format').value;
        const outputFormat = document.getElementById('output-format').value;

        convertFile(selectedFile, inputFormat, outputFormat);
    });

    // Конвертация файла (здесь можно реализовать логику конвертации)
    function convertFile(file, inputFormat, outputFormat) {
        // Имитация конвертации для примера
        const progressText = document.getElementById('progress-text');
        const progressContainer = document.getElementById('progress-container');
        const progressFill = document.getElementById('progress-fill');
        const convertedImage = document.getElementById('converted-image');
        const outputImage = document.getElementById('output-image');
        const downloadLink = document.getElementById('download-link');

        progressText.textContent = languages[lang].progressStart;
        progressContainer.style.display = 'block';

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = languages[lang].converting.replace('{progress}', progress);
            if (progress >= 100) {
                clearInterval(interval);
                progressText.textContent = languages[lang].conversionComplete;
                // Здесь следует добавить реальную логику конвертации файла
                // Пример: загрузка сгенерированного изображения
                outputImage.src = URL.createObjectURL(file); // Для примера используем тот же файл
                convertedImage.style.display = 'block';
                downloadLink.href = URL.createObjectURL(file);
                downloadLink.style.display = 'block';
            }
        }, 500);
    }

    // Переключение видимости конвертера
    document.getElementById('toggle-button').addEventListener('click', () => {
        const converterContent = document.getElementById('converter-content');
        const isVisible = converterContent.style.display === 'block';
        converterContent.style.display = isVisible ? 'none' : 'block';
    });

    // Стили для перетаскиваемой области
    const styles = `
        #drop-area:hover {
            background-color: #f0f0f0;
        }
        #drop-area:active {
            background-color: #d0d0d0;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Инициализация языка
    updateLanguage();
})();
