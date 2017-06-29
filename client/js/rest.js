;(function (service,$) {

    function execute({url='/notes', method='GET', data}) {
        let request = {
            dataType: 'json',
            contentType: 'application/json',
            method: method,
            url: "/rest" + url
        };
        if(data) {
            request.data = JSON.stringify(data);
        }
        return $.ajax(request);
    }

    function getAll(){
        return execute({});
    }

    function getById(id) {
        return execute({url:'/notes/' + id});
    }

    function create(note) {
        return execute({method: 'POST', data: note});
    }

    function update(id, note) {
        return execute({url:'/notes/' + id, method: 'PUT', data: note});
    }

    service.rest = {
        getAll : getAll,
        getById: getById,
        create: create,
        update: update
    };

}(window.service = window.service || { }, jQuery));


