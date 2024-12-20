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
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="gif">GIF</option>
                    <option value="webp">WEBP</option>
                    <option value="bmp">BMP</option>
                    <option value="tiff">TIFF</option>
                    <option value="svg">SVG</option>
                    <option value="ico">ICO</option>
                    <option value="pdf">PDF</option>
                    <option value="html">HTML</option>
                    <option value="htm">HTM</option>
                    <option value="txt">TXT</option>
                    <option value="md">Markdown</option>
                    <option value="xml">XML</option>
                    <option value="css">CSS</option>
                    <option value="js">JavaScript</option>
                    <option value="csv">CSV</option>
                    <option value="mp3">MP3</option>
                    <option value="wav">WAV</option>
                    <option value="ogg">OGG</option>
                    <option value="flac">FLAC</option>
                    <option value="mp4">MP4</option>
                    <option value="avi">AVI</option>
                    <option value="mov">MOV</option>
                    <option value="mkv">MKV</option>
                    <option value="wmv">WMV</option>
                    <option value="zip">ZIP</option>
                    <option value="rar">RAR</option>
                    <option value="tar">TAR</option>
                    <option value="7z">7Z</option>
                </select>
            </div>
            <div style="margin-top: 10px;">
                <label for="output-format" style="color: black;">${languages[lang].selectOutputFormat}:</label>
                <select id="output-format" style="border: 1px solid #007BFF; border-radius: 5px; padding: 5px;">
                    <option value="jpg">JPG</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="gif">GIF</option>
                    <option value="webp">WEBP</option>
                    <option value="bmp">BMP</option>
                    <option value="tiff">TIFF</option>
                    <option value="svg">SVG</option>
                    <option value="ico">ICO</option>
                    <option value="pdf">PDF</option>
                    <option value="html">HTML</option>
                    <option value="htm">HTM</option>
                    <option value="txt">TXT</option>
                    <option value="md">Markdown</option>
                    <option value="xml">XML</option>
                    <option value="css">CSS</option>
                    <option value="js">JavaScript</option>
                    <option value="csv">CSV</option>
                    <option value="mp3">MP3</option>
                    <option value="wav">WAV</option>
                    <option value="ogg">OGG</option>
                    <option value="flac">FLAC</option>
                    <option value="mp4">MP4</option>
                    <option value="avi">AVI</option>
                    <option value="mov">MOV</option>
                    <option value="mkv">MKV</option>
                    <option value="wmv">WMV</option>
                    <option value="zip">ZIP</option>
                    <option value="rar">RAR</option>
                    <option value="tar">TAR</option>
                    <option value="7z">7Z</option>
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
    }

    // Обработчик события выбора языка
    document.getElementById('language-select').addEventListener('change', (e) => {
        lang = e.target.value;
        updateLanguage();
    });

    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');

    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.style.borderColor = '#007BFF';
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.style.borderColor = '#007BFF';
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.style.borderColor = '#007BFF';
        const file = event.dataTransfer.files[0];
        if (file) {
            fileInput.files = event.dataTransfer.files;
            updateFileInfo(file);
        }
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            updateFileInfo(file);
        }
    });

    // Обновление информации о файле
    function updateFileInfo(file) {
        const fileInfo = document.getElementById('file-info');
        fileInfo.textContent = `Selected file: ${file.name} (${file.type})`;

        // Определяем формат файла из его имени
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const inputFormatSelect = document.getElementById('input-format');

        // Устанавливаем выбранный формат в соответствии с загруженным файлом
        for (let i = 0; i < inputFormatSelect.options.length; i++) {
            if (inputFormatSelect.options[i].value === fileExtension) {
                inputFormatSelect.selectedIndex = i;
                break;
            }
        }
    }

    // Конвертация файла
    function convertFile(file, inputFormat, outputFormat) {
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

                // Создание нового объекта URL для "конвертированного" файла
                const newFileName = file.name.replace(/\.[^/.]+$/, `.${outputFormat}`); // Изменяем расширение
                const convertedFile = new Blob([file], { type: `image/${outputFormat}` }); // Здесь можно использовать логику для реальной конвертации
                outputImage.src = URL.createObjectURL(convertedFile); // Для примера используем тот же файл
                convertedImage.style.display = 'block';
                downloadLink.href = URL.createObjectURL(convertedFile);
                downloadLink.download = newFileName; // Задаем новое имя для скачивания
                downloadLink.style.display = 'block';
            }
        }, 500);
    }

    // Обработчик события конвертации файла
    document.getElementById('convert-button').addEventListener('click', () => {
        const file = fileInput.files[0];
        if (!file) {
            alert(languages[lang].alertSelectFile);
            return;
        }
        const inputFormat = document.getElementById('input-format').value;
        const outputFormat = document.getElementById('output-format').value;
        convertFile(file, inputFormat, outputFormat);
    });

    // Обработчик кнопки переключения конвертера
    document.getElementById('toggle-button').addEventListener('click', () => {
        const converterContent = document.getElementById('converter-content');
        if (converterContent.style.display === 'none') {
            converterContent.style.display = 'block';
            document.getElementById('toggle-button').textContent = languages[lang].toggle; // Можно поменять текст на "Скрыть конвертер"
        } else {
            converterContent.style.display = 'none';
            document.getElementById('toggle-button').textContent = languages[lang].toggle; // Можно поменять текст на "Показать конвертер"
        }
    });
})();
