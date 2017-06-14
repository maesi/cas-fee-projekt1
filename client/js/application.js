$(window).ready(() => {
    window.templates.loader.get("header", window.model.model.getHeaderConfig())
        .then((template) => {
            $('header').html(template);
        });
    window.templates.loader.get("edit", window.model.model.getNotes())
        .then((template) => {
            $('main').html(template);
        });
});
