customColorPalette = [
        {'color': 'hsl(4, 90%, 58%)', 'label': 'Red'},
        {'color': 'hsl(340, 82%, 52%)', 'label': 'Pink'},
        {'color': 'hsl(291, 64%, 42%)', 'label': 'Purple'},
        {'color': 'hsl(262, 52%, 47%)', 'label': 'Deep Purple'},
        {'color': 'hsl(231, 48%, 48%)', 'label': 'Indigo'},
        {'color': 'hsl(207, 90%, 54%)', 'label': 'Blue'},
        {'color': 'hsl(50, 100%, 50%)', 'label': 'Yellow'},
        {'color': 'hsl(120, 60%, 50%)', 'label': 'Green'},
    ]

CKEDITOR_5_CONFIGS = {
    'default': {
        'language': 'fr',
        'toolbar': ['heading', '|', 'bold', 'italic', 'underline', 'strikethrough',
                    'link', 'alignment', 'fontColor', 'fontBackgroundColor', '|',
                    'bulletedList', 'numberedList', 'todoList', '|', 'blockQuote', 'codeBlock',
                    'imageUpload', 'insertTable', 'mediaEmbed', 'removeFormat', 'sourceEditing',
                    'fullScreen'],
        'title': 'Éditeur de texte avancé'
    },
    'extends': {
        'language': 'fr',
        'blockToolbar': [
            'paragraph', 'heading1', 'heading2', 'heading3', '|',
            'bulletedList', 'numberedList', 'todoList', '|', 'blockQuote', 'alignment',
        ],
        'toolbar': ['heading', '|', 'outdent', 'indent', '|', 'bold', 'italic', 'link',
                    'underline', 'strikethrough', 'code', 'subscript', 'superscript',
                    'highlight', '|', 'codeBlock', 'sourceEditing', 'insertImage',
                    'bulletedList', 'numberedList', 'todoList', '|', 'blockQuote', 'imageUpload',
                    'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'mediaEmbed',
                    'insertTable', 'removeFormat', 'alignment', 'fullScreen'],
        'image': {
            'toolbar': ['imageTextAlternative', 'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight'],
            'styles': ['full', 'side', 'alignLeft', 'alignCenter', 'alignRight']
        },
        'table': {
            'contentToolbar': ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
            'tableProperties': {
                'borderColors': customColorPalette,
                'backgroundColors': customColorPalette
            },
            'tableCellProperties': {
                'borderColors': customColorPalette,
                'backgroundColors': customColorPalette
            }
        },
        'heading': {
            'options': [
                {'model': 'paragraph', 'title': 'Paragraphe', 'class': 'ck-heading_paragraph'},
                {'model': 'heading1', 'view': 'h1', 'title': 'Titre 1', 'class': 'ck-heading_heading1'},
                {'model': 'heading2', 'view': 'h2', 'title': 'Titre 2', 'class': 'ck-heading_heading2'},
                {'model': 'heading3', 'view': 'h3', 'title': 'Titre 3', 'class': 'ck-heading_heading3'}
            ]
        },
        'ui': {
            'tooltip': {
                'bold': 'Gras',
                'italic': 'Italique',
                'underline': 'Souligné',
                'strikethrough': 'Barré',
                'link': 'Insérer un lien',
                'alignment': 'Alignement du texte',
                'bulletedList': 'Liste à puces',
                'numberedList': 'Liste numérotée',
                'insertTable': 'Insérer un tableau',
                'imageUpload': 'Télécharger une image'
            }
        },
        'balloonToolbar': ['bold', 'italic', 'underline', 'link', 'alignment'],
        'tooltipPosition': 'right'  # Positionner les tooltips à droite
    },
    'list': {
        'language': 'fr',
        'properties': {
            'styles': 'true',
            'startIndex': 'true',
            'reversed': 'true',
        }
    }
}

# Forcer la langue en français dans Django settings
CKEDITOR_5_LANGUAGE = 'fr'

# Permissions avancées
CKEDITOR_5_FILE_UPLOAD_PERMISSION = "staff"

# CSS pour ajuster la position des tooltips
CKEDITOR_EXTRA_CSS = "body .ck-tooltip { right: 50%; left: auto; transform: translateX(-10px); }"
