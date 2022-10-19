$(document).ready(() => {
	$('#tracking-code').on('keyup', getTrackingCode);
	$('#tracking-code').on('change', getTrackingCode);
});

var attempts = 0;
var showAttemptsMessage = true;

function attempt(){
	attempts++;

	if ((attempts > 3) && showAttemptsMessage) {
		showAttemptsMessage = false;

		$('#attempts').animate({opacity: 'show', marginTop: '20px'}, 500);
	}
}

function loading(bool) {
	if (bool) {
		$('#searching').removeClass('d-none');
		$('#searching').addClass('action');
	}else{
		$('#searching').removeClass('action');
	}
}

function getTrackingCode(e){
	const code = $(this).val();
	const key = (e.keyCode || e.which);

	if(key == 37 || key == 38 || key == 39 || key == 40) {
        return;
    }

	if (code.length === 13) {
		$(this).prop('disabled', true);

		console.log('now');
		track(code, $(this));
		attempt();
	}
}

function track(code, input) {
	$('#info-container').removeClass('action');
	$('#info-container').empty();
	loading(true);

	fetch(`/${code}`)
    .then( response => response.json() )
    .then( (data) => {
    	renderEvents(data);
    	input.prop('disabled', false);
    	loading(false);
    })
    .catch((e) => {
		console.log(e);
		$('#not-found').text('Houve um erro inesperado.');
		$('#not-found').animate({opacity: 'show', marginTop: '20px'});
		setTimeout(() => {
			$('#not-found').animate({opacity: 'hide', marginTop: '0px'});
		}, 10000);

    	input.prop('disabled', false);
    	loading(false);
    })
}

function renderEvents(data){
	const events = data.result.events;
	console.log('length', events.length);
	if (events.length < 1) {
		$('#not-found').text('O código está incorreto ou ainda não se encontra no sistema dos Correios.');
		$('#not-found').animate({opacity: 'show', marginTop: '20px'});
		setTimeout(() => {
			$('#not-found').animate({opacity: 'hide', marginTop: '0px'});
		}, 10000);
	}else{

		$('#searching').addClass('d-none');

		const cpfLink = '<a href="https://apps.correios.com.br/cas/login">https://apps.correios.com.br/cas/login</a>';

		$(events).each((index, item) => {
			$('#info-container').append(`
				<div class="object-info p-3 my-4 bg-primary text-light" style="position: relative;">
					<h5>${item.event}</h5>
					<p style="font-size: 14px;">${item.message.indexOf('CPF') > 1?`Para acompanhamento da fiscalização aduaneira acesse ${$.parseHTML(cpfLink)}`:item.message}</p>
					<span class="alert alert-light p-1">${item.date} - ${item.hour}</span>
					<span class="alert alert-light p-1">${item.location}</span>
					<span class="alert alert-success p-1">N.° ${events.length - index}</span>

					<div class="pp"></div>
				</div>
			`);
		});

		$('#info-container').addClass('action');
	}
}