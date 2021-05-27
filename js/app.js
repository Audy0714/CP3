const app = {
	replayButtonElement: null,
	// Le jeu est-il terminé ou pas ?
	gameOver: true,

	defaultRanges: {
		min: 0,
		max: 100,
	},
	resultRanges: {},
	searchNumber: null,
	currentProposition: null,

	/**
	 * Fonction qui permet de raffraichir l'affichage des bornes en HTML
	 */
	refreshRanges: () => {
		// Je cible les min et max
		const minRangeElement = document.querySelector('#minRange');
		const maxRangeElement = document.querySelector('#maxRange');

		// J'écrit la valeur de base dans ces 2 éléments
		minRangeElement.textContent = app.resultRanges.min;
		maxRangeElement.textContent = app.resultRanges.max;

		const resultRangeElement = document.querySelector('#resultRange');
		// Si jamais le résultat a été trouvé alors on affiche le résultat
		if (app.currentProposition === app.searchNumber) {
			resultRangeElement.textContent = app.searchNumber;
		}
		// Sinon on remet un ?
		else {
			resultRangeElement.textContent = '?';
		}
	},

	/**
	 * Génère une nombre aléatoire entre min et max
	 * @param {number} min
	 * @param {number} max
	 */
	getRandomNumber: (
		min,
		max // Pas de return puisque j'ai des parenthèses, ça fait office de return
	) => Math.round(Math.random() * (max - min) + min),

	handleFormSubmit: (event) => {
		// Pour ne pas recharger la page
		event.preventDefault();
		// Si le jeu est terminé on interprète pas le formulaire
		if (app.gameOver) {
			return;
		}
		// Je commence par récupérer le formulaire qui est en fait la cible de l'évènement submit qui vient de se produire
		const form = event.target;
		// Je cible le champ texte du formulaire pour récupérer sa valeur
		const inputRangeElement = form.querySelector('#inputProp');
		// Puis je récupére sa value
		const inputValue = parseInt(inputRangeElement.value, 10);
		// 1°Je vérifie que cette value est correcte
		// Est-elle un chiffre ?
		if (isNaN(inputValue)) {
			// J'affiche un message à l'utilisateur
			app.showMessage(
				`La valeur "${inputRangeElement.value}" n'est pas un nombre`
			);
			// Une erreur sur la saisie de la valeur, donc on return pour éviter de continuer l'éxecution de la fonction
			return;
		}
		// Est-elle bien comprise entre les bornes initiales ?
		else if (
			inputValue < app.defaultRanges.min ||
			inputValue > app.defaultRanges.max
		) {
			// J'affiche un message à l'utilisateur
			app.showMessage(
				`Attention vous devez écrire un chiffre entre ${app.defaultRanges.min} et ${app.defaultRanges.max}`
			);
			// Une erreur sur la saisie de la valeur, donc on return pour éviter de continuer l'éxecution de la fonction
			return;
		}
		// 2°Je range la value dans la propriété currentProposition de app
		app.currentProposition = inputValue;
		// Je vide le champs et je remets le focus dessus pour faciliter la prochaine saisie
		inputRangeElement.value = '';
		inputRangeElement.focus();
		// Maintenant tout est à jour, je vérifie si l'utilisateur a répondu juste ou pas
		app.checkLastProposition();
	},

	checkLastProposition: () => {
		// Si l'utilisateur a trouvé la proposition, alors on lui dit qu'il a gagné
		if (app.currentProposition === app.searchNumber) {
			app.showMessage(
				`Félicitation tu as trouvé le juste prix qui était ${app.searchNumber}, tu gagnes un 4x4 !`
			);
			// J'affiche le bouton de replay une fois la partie terminée
			app.replayButtonElement.classList.remove('hidden');
			app.gameOver = true;
		}
		// Si la proposition est inférieure au chiffre à trouver c'est qu'il faut proposer plus
		else if (app.currentProposition < app.searchNumber) {
			// Alors je l'informe
			app.showMessage(`C'est plus`);
			// Puis la proposition est supérieure à la borne mini sauvegardée
			if (app.currentProposition > app.resultRanges.min) {
				// Alors je met à jour la borne mini
				app.resultRanges.min = app.currentProposition;
			}
		}
		// Si la proposition est supérieure au chiffre à trouver c'est qu'il faut proposer moins
		else if (app.currentProposition > app.searchNumber) {
			// Alors je l'informe
			app.showMessage(`C'est moins`);
			// Puis la proposition est inférieur à la borne max sauvegardée
			if (app.currentProposition < app.resultRanges.max) {
				// Alors je met à jour la borne max
				app.resultRanges.max = app.currentProposition;
			}
		}
		// La variable est à jour, je déclenche une fonction qui refresh le code HTML
		app.showLastProposition(`Dernière proposition : ${app.currentProposition}`);
		// Et dans tout les cas je met à jour les ranges dans le HTML
		app.refreshRanges();
	},

	/**
	 * Fonction qui modifie la div lastProp pour afficher la dernière proposition
	 */
	showLastProposition: (lastPropsMessage = 'Aucune proposition récente') => {
		// Je commence par cibler la div
		const lastPropsElement = document.querySelector('#lastProp');
		// Puis je modifie son contenu
		lastPropsElement.textContent = lastPropsMessage;
	},

	/**
	 * Fonction qui modifie la div result pour afficher un message en particulier
	 */
	showMessage: (messageToShow = 'Propose un nombre !') => {
		const messageElement = document.querySelector('#message');
		messageElement.textContent = messageToShow;
	},

	/**
	 * Fonction qui lance une nouvelle partie
	 */
	newRound: () => {
		// Le jeu vient de commencer, je remets gameOver à false pour lancer une partie
		app.gameOver = false;

		// Je cache le bouton de replay quand je lance une partie
		app.replayButtonElement.classList.add('hidden');

		// Je créé un nouvel objet pour remettre les ranges aux valeurs par défaut
		app.resultRanges = {
			min: app.defaultRanges.min,
			max: app.defaultRanges.max,
		};

		// Je recharge le nombre à chercher
		app.searchNumber = app.getRandomNumber(
			app.defaultRanges.min,
			app.defaultRanges.max
		);

		// Je remet les messages à leurs valeurs par défaut
		app.showLastProposition();
		app.showMessage();

		// Et je refresh la vue avec les nouvelles valeurs des variables
		app.refreshRanges();
	},

	/**
	 * Fonction permettant d'initialiser l'objet app
	 */
	init: () => {
		console.log('Init loaded');
		// Je branche le bouton de replay à son listener
		// Je commence par le cibler
		app.replayButtonElement = document.querySelector('#replayGame');
		app.replayButtonElement.addEventListener('click', app.newRound);

		// Je branche le formulaire à son listener
		// Je commence par le cibler
		const form = document.querySelector('#rangeGame form');
		form.addEventListener('submit', app.handleFormSubmit);

		// Le jeu étant initialisé, je lance une nouvelle partie
		app.newRound();
	},
};

// Le listener pour lancer l'init d'app quand le dom aura fini de charger
document.addEventListener('DOMContentLoaded', app.init);
