$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    var actions = $("table td:last-child").html();
    actions = '<a class="add" title="" data-toggle="tooltip" data-original-title="Add" style="display: inline;"><i class="material-icons"></i></a>\n' +
        '                <!--a.edit(title=\'Edit\', data-toggle=\'tooltip\')i.material-icons \n' +
        '                --><a class="delete" title="" data-toggle="tooltip" data-original-title="Delete"><i class="material-icons"></i></a>\n' +
        '              '
    // Append table with add row form on add new button click
    $(".add-new").click(function(){
        $(this).attr("disabled", "disabled");
        var index = $("table tbody tr:last-child").index();
        var row = '<tr>' +
            '<td><input type="number" class="form-control" name="number" id="number"></td>' +
            '<td><input type="text" class="form-control" name="name" id="name"></td>' +
            '<td><input type="date" class="form-control" name="date" id="date"></td>' +
            '<td><input type="number" class="form-control" name="verification" id="verification"></td>' +
            '<td>' + actions + '</td>' +
            '</tr>';
        //console.log(actions);
        $("table").append(row);
        $("table tbody tr").eq(index).find(".add").toggle();
        $('[data-toggle="tooltip"]').tooltip();
    });
    // Add row on add button click
    $(document).on("click", ".add", function(){
        //console.log('add clicked');
        var empty = false;
        var input = $(this).parents("tr").find(':input')
        //console.log(input);
        var val = [];
        input.each(function(){
            val.push($(this).val());
            ////console.log($(this).val());
            if(!$(this).val()){
                $(this).addClass("error");
                empty = true;
            } else{
                $(this).removeClass("error");
            }
        });
        var data = {
            num: val[0],
            name: val[1],
            date: val[2],
            verify: val[3],
        };

        //console.log(data);

        $(this).parents("tr").find(".error").first().focus();
        if(!empty){
            input.each(function(){
                $(this).parent("td").html($(this).val());
            });
            $(this).parents("tr").find(".add").toggle();
            $.ajax({
                url: '/addcard',
                type: 'post',
                dataType: 'json',
                data: data
            }).done(function () {
                alert('add card succeed!')

                //console.log('good!');
            }).fail(function () {
                alert('failed! please check your information again')
            }).always(function () {
                window.location.reload(false);
            })
            $(".add-new").removeAttr("disabled");
        }
    });
    // Edit row on edit button click
    $(document).on("click", ".edit", function(){
        $(this).parents("tr").find("td:not(:last-child)").each(function(){

            $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
        });

        $(this).parents("tr").find(".add").toggle();
        $(".add-new").attr("disabled", "disabled");
    });
    // Delete row on delete button click
    $(document).on("click", ".delete", function(){

        var val = [];
        var input = $(this).parents("tr").find('td:not(:last-child)').each(function () {
            val.push($(this).val());
        })
        var data = {
            num: val[0],
            name: val[1],
            date: val[2],
            verify: val[3],
        };
        $.ajax({
            url: '/deletecard',
            type: 'post',
            dataType: 'json',
            data: data
        }).done(function () {
            alert('delete card succeed!')
            //window.location.reload(false);
            //console.log('good!');
        }).fail(function () {
            alert('failed! try again!')
        }).always(function () {
            window.location.reload(false);
        })

        $(this).parents("tr").remove();
        $(".add-new").removeAttr("disabled");
    });
});