var c = console,
    csvTable;

window.onload = function() {
    $('#files').on('change', function(e) {
        var files = $('#files')[0].files;

        if (!files.length) {
            alert('Please select a file!');
            return;
        }

        var file    = files[0],
            reader  = new FileReader();

        reader.onloadend = function(e) {
            if (e.target.readyState == FileReader.DONE) {
                $('#byte_content').text(e.target.result);
                data = CSVtoJSON(e.target.result);

                if ($('#stats').hasClass('dataTable')) {
                    csvTable.clear();
                    csvTable.destroy();
                    $('#stats').html('').css({ width: '100%' });
                }

                csvTable = $('#stats').DataTable({
                    columns: data.headers,
                    data: data.rows,
                    paging: true,
                    searching: true,
                    scrollY: '500px',
                    scrollX: 'auto',
                    dom: 'RC<"clear">lfrtip',
                    oColVis: {
                        sAlign: "right",
                        iOverlayFade: 0
                    },
                });

                if ($('#stats > tbody > tr:first').text() === '') {
                    $('#stats > tbody > tr:first').hide();
                }

                $('#csv > pre').text(e.target.result);
                $('#json > pre').text(JSON.stringify(data.rows, null, 4));

            }
        };

        reader.readAsText(file);
    });
};

function CSVtoJSON(data, options) {
    var defaults = {
        delimiter: ',',
        newLine: '\n'
    };

    var settings = $.extend(defaults, options);
    var firstLine = null;

    for (line in data) {
        if (line.split(settings.delimiter).length > 0) {
            firstLine = line;
            break;
        }
    }

    if (firstLine === null) {
        alert('No CSV data was found.');
        return;
    }

    var dataArr     = data.split(settings.newLine),
        headers     = dataArr[firstLine].split(settings.delimiter),
        dataObj     = [],
        headerObj   = [];

    for (header in headers) {
        headerObj.push({
            data: headers[header],
            title: headers[header]
        });
    }

    for (var i = parseFloat(firstLine +1); i < dataArr.length; i++) {
        if (dataArr[i].split(settings.delimiter).length === 0) { continue; }
        var tmpObj = {};

        for (pos in headers) {
            tmpObj[headers[pos]] = dataArr[i].split(settings.delimiter)[pos] || '';
        }

        dataObj.push(tmpObj);
    }
    return { headers: headerObj, rows: dataObj };
}
