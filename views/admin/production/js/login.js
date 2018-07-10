$("#frm").submit(function (event) {
    $.post('/admin/login', $("#frm").serialize(), function (data) {
        console.log(data) //data is the response from the backend
    });
    event.preventDefault();
});