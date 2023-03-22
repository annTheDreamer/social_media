'use strict';

let socialMediaPosts = [];
let posts = [];
const sidebar = document.querySelector('.sidebar');
const gridPosts = document.querySelector('.preview');
let postsWraper = document.querySelector('.posts-wrapper');
const loadMoreBtn = document.querySelector('.load-more-btn');
const loadingNumber = 3; //starting from 0 to 3, total of 4 cards
const cardColorInput = document.getElementById('cardBackgroundColor');
let color = cardColorInput.value;
const gapInput = document.getElementById('cardSpaceBetween');
const lightThemeRadioBtn = document.getElementById('lightTheme');
const darkThemeRadioBtn = document.getElementById('darkTheme');
const theme = document.getElementsByName('theme');
const filterBySource = document.getElementsByName('filterBySource');
const numberOfSelectedColumns = document.getElementById('numberOfColumns');
let testMediaQuery = window.matchMedia('(max-width: 992px)');
let desktopWidth = window.matchMedia('(min-width: 993px)');
let width1300 = window.matchMedia('(max-width: 1300px)');
let filterBtn = 'all';

//Variables for Modal Window
const overlay = document.querySelector('.overlay');
let modal = document.querySelector('.modal');
modal.style.display = 'none';
let modalImageContainer = document.querySelector('.modal-image-container');
let modalPostImage = document.getElementById('modal-post-image');
let modalPostInfoContainer = document.querySelector(
	'.modal-post-info-container'
);
let modalHeaderContainer = document.getElementById('modal-header-container');
let modalCircleImageContainer = document.getElementById(
	'modal-circle-image-container'
);
let modalProfilePicture = document.getElementById('modal-profile-picture');
let modalHeaderInfo = document.getElementById('modal-header-info');
let modalFullName = document.getElementById('modal-full-name');
let modalDate = document.getElementById('modal-date');
let modalLogo = document.getElementById('modal-logo');
let modalLine = document.getElementById('modal-line');
let modalCaption = document.getElementById('modal-caption');
let modalLikesContainer = document.getElementById('modal-likes');
let modalHeartIcon = document.getElementById('modal-heart-icon');
let modalNumberOfLikes = document.getElementById('modal-number-of-likes');

fetch('../data.json')
	.then((response) => response.json())
	.then((data) => {
		socialMediaPosts = data;
		posts = data;
		displayPosts(data);
	})
	.catch((err) => console.log(err));

const dateFormatter = function (date) {
	const dateObject = new Date(date);
	const formattedDate = `${dateObject.getDate()} ${dateObject.toLocaleString(
		'default',
		{ month: 'short' }
	)} ${dateObject.getFullYear()}`;
	return formattedDate;
};

const typeOfLogo = function (logoType) {
	return logoType === 'facebook'
		? '../icons/facebook.svg'
		: '../icons/instagram-logo.svg';
};

const themeSwitch = function () {
	let section = document.querySelectorAll('.section');
	const heartLogos = document.querySelectorAll('.hearts');

	if (darkThemeRadioBtn.checked) {
		for (let i = 0; i < section.length; i++) {
			section[i].style.backgroundColor = 'black';
			section[i].style.color = 'white';
			if (!heartLogos[i].classList.contains('red-heart')) {
				heartLogos[i].classList.add('white-heart');
				heartLogos[i].classList.remove('black-heart');
			}
		}
	} else {
		for (let i = 0; i < section.length; i++) {
			section[i].style.backgroundColor = 'white';
			section[i].style.color = 'black';
			if (!heartLogos[i].classList.contains('red-heart')) {
				heartLogos[i].classList.add('black-heart');
				heartLogos[i].classList.remove('white-heart');
			}
		}
	}
};

const changingCardBackground = function () {
	let section = document.querySelectorAll('.section');
	for (let i = 0; i < section.length; i++)
		section[i].style.backgroundColor = color;
	console.log(color);
};

const filterValue = function (inputData, value) {
	let filteredValues = [];
	for (let i = 0; i < inputData.length; i++) {
		if (inputData[i]['source_type'] === value)
			filteredValues.push(inputData[i]);
	}
	if (filteredValues.length <= loadingNumber + 1)
		loadMoreBtn.style.display = 'none';
	else loadMoreBtn.style.display = 'block';
	return filteredValues;
};

const removeSections = function (parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
};

const disablingNumberOfColumns = function (mediaQuery) {
	if (mediaQuery.matches) numberOfSelectedColumns.disabled = true;
	else numberOfSelectedColumns.disabled = false;
};

//Making card posts smaller for desktops below 1300px
const checkWidth1300 = function () {
	let sections = document.querySelectorAll('.section');
	let posts = document.querySelectorAll('.post');
	let postImageContainers = document.querySelectorAll(
		'.post-image-container'
	);
	if (!width1300.matches) {
		sidebar.style.width = '340px';
		for (let i = 0; i < postImageContainers.length; i++) {
			postImageContainers[i].style.height = '300px';
			posts[i].style.height = '490px';
			sections[i].style.height = '535px';
		}
	}
	if (width1300.matches && numberOfSelectedColumns.value !== 'dynamic') {
		sidebar.style.width = 'auto';
		for (let i = 0; i < postImageContainers.length; i++) {
			postImageContainers[i].style.height = '200px';
			posts[i].style.height = '390px';
			sections[i].style.height = '435px';
		}
	}
};

const createElement = function (element, className) {
	const newElement = document.createElement(element);
	newElement.classList.add(className);
	return newElement;
};

const createImageElement = function (source, className) {
	const newImage = document.createElement('img');
	newImage.src = source;
	if (className !== 'undefined') newImage.classList.add(className);
	return newImage;
};

const createTextElement = function (textElement, textContent, className) {
	const newTextElement = document.createElement(textElement);
	newTextElement.textContent = textContent;
	if (className !== 'undefined') newTextElement.classList.add(className);
	return newTextElement;
};

//Changing heart color and likes counter
const redHeartFunctionality = function (likesNumber, icon) {
	let numOfLikes = Number(likesNumber.textContent);
	console.log(icon);
	if (icon.classList.contains('red-heart')) {
		if (lightThemeRadioBtn.checked) {
			icon.classList.add('black-heart');
			icon.classList.remove('white-heart');
		} else {
			icon.classList.add('white-heart');
			icon.classList.remove('black-heart');
		}
		numOfLikes--;
		likesNumber.textContent = numOfLikes;
		icon.classList.remove('red-heart');
	} else {
		if (darkThemeRadioBtn.checked) {
			icon.classList.remove('black-heart');
			icon.classList.remove('white-heart');
		} else {
			icon.classList.remove('white-heart');
			icon.classList.remove('black-heart');
		}
		numOfLikes++;
		likesNumber.textContent = numOfLikes;
		icon.classList.add('red-heart');
	}
};

const creatingModalWindow = function (object) {
	overlay.classList.remove('hidden');
	modal.style.display = 'grid';
	modal.classList.remove('hidden');
	modalImageContainer.classList.remove('hidden');
	modalPostImage.classList.remove('hidden');
	modalPostImage.src = object['image'];
	modalPostInfoContainer.classList.remove('hidden');
	modalProfilePicture.classList.remove('hidden');
	modalProfilePicture.src = object['profile_image'];
	modalFullName.textContent = object['name'];
	modalDate.textContent = dateFormatter(object['date']);
	modalLogo.src = typeOfLogo(object['source_type']);
	modalCaption.textContent = object['caption'];
	modalLikesContainer.style.border = 'none';
	modalLikesContainer.style.bottom = 'auto';
	modalHeartIcon.src = '../icons/heart.svg';
	modalNumberOfLikes.textContent = object['likes'];
	modalHeartIcon.addEventListener('click', () => {
		redHeartFunctionality(modalNumberOfLikes, modalHeartIcon);
	});
};

const displayPosts = function (socialMediaPosts, loadedPosts = 0) {
	for (let i = 0; i < socialMediaPosts.length; i++) {
		if (loadedPosts > 0 && i < loadedPosts) continue;
		let postContainer = createElement('section', 'section');
		let headerPostContainer = createElement('div', 'header-post-container');
		let likesContainer = createElement('div', 'likes');
		let post = createElement('div', 'post');
		let profileImageContainer = createElement('div', 'circle-image');
		let profilePicture = createImageElement(
			socialMediaPosts[i]['profile_image']
		);
		let headerPostInfo = document.createElement('div');
		let fullName = createTextElement('h3', socialMediaPosts[i]['name']);
		let date = createTextElement(
			'p',
			dateFormatter(socialMediaPosts[i]['date'])
		);

		let logo = createImageElement(
			typeOfLogo(socialMediaPosts[i]['source_type']),
			'logo'
		);
		let postImageContainer = createElement('div', 'post-image-container');
		let postImage = createImageElement(socialMediaPosts[i]['image']);
		let caption = createTextElement(
			'p',
			socialMediaPosts[i]['caption'],
			'caption'
		);
		let likeIcon = createImageElement('../icons/heart.svg');
		likeIcon.classList.add('logo', 'heart', 'hearts');
		let numberOfLikes = createTextElement(
			'div',
			socialMediaPosts[i]['likes'],
			'heart'
		);

		likeIcon.addEventListener('click', () => {
			redHeartFunctionality(numberOfLikes, likeIcon);
		});

		//Nesting all created elements in one post
		profileImageContainer.appendChild(profilePicture);
		headerPostInfo.appendChild(fullName);
		headerPostInfo.appendChild(date);
		headerPostContainer.appendChild(profileImageContainer);
		headerPostContainer.appendChild(headerPostInfo);
		headerPostContainer.appendChild(logo);
		post.appendChild(headerPostContainer);
		postImageContainer.appendChild(postImage);
		post.appendChild(postImageContainer);
		post.appendChild(caption);
		likesContainer.appendChild(likeIcon);
		likesContainer.appendChild(numberOfLikes);
		post.appendChild(likesContainer);
		postContainer.appendChild(post);
		postsWraper.appendChild(postContainer);

		//Event listener for Modal Window (not finished - not functional on load more)
		postImageContainer.addEventListener('click', () => {
			creatingModalWindow(socialMediaPosts[i]);
		});
		overlay.addEventListener('click', () => {
			modal.style.display = 'none';
			modal.classList.add('hidden');
			overlay.classList.add('hidden');
		});
		if (i >= loadingNumber + loadedPosts) break;
	}
};

//Laod 4 more posts
loadMoreBtn.addEventListener('click', () => {
	if (socialMediaPosts.length) {
		if (filterBtn === 'all') {
			displayPosts(socialMediaPosts, loadingNumber + 1);
			socialMediaPosts.splice(0, loadingNumber + 1);
			if (socialMediaPosts.length <= loadingNumber + 1)
				loadMoreBtn.style.display = 'none';
		} else {
			posts = filterValue(posts, filterBtn);
			displayPosts(posts, loadingNumber + 1);
			posts.splice(0, loadingNumber + 1);
			if (posts.length <= loadingNumber + 1)
				loadMoreBtn.style.display = 'none';
		}

		changingCardBackground();
		themeSwitch();
		checkWidth1300();
	}
});

cardColorInput.addEventListener('change', () => {
	color = cardColorInput.value;
	changingCardBackground();
});

gapInput.addEventListener('change', () => {
	postsWraper.style.gap = gapInput.value;
});

for (let i = 0; i < theme.length; i++) {
	theme[i].addEventListener('change', themeSwitch);
}

//Filter functionality
for (let i = 0; i < filterBySource.length; i++) {
	filterBySource[i].addEventListener('change', () => {
		filterBtn = filterBySource[i]['value'];
		posts = socialMediaPosts;
		if (filterBySource[i].checked) {
			removeSections(postsWraper);
			switch (filterBySource[i]['value']) {
				case 'instagram':
					displayPosts(filterValue(socialMediaPosts, 'instagram'));
					break;
				case 'facebook':
					displayPosts(filterValue(socialMediaPosts, 'facebook'));
					break;
				case 'twitter':
					displayPosts(filterValue(socialMediaPosts, 'twitter'));
					break;
				default:
					displayPosts(socialMediaPosts);
					loadMoreBtn.style.display = 'block';
			}
		}
		changingCardBackground();
		themeSwitch();
	});
}

//if the width of the viewport is less than 992px, the option to select number of columns displayed is disabled
testMediaQuery.addEventListener('change', disablingNumberOfColumns);

//Number of Columns functionality
numberOfSelectedColumns.addEventListener('change', () => {
	let numberOfColumns = numberOfSelectedColumns.value;
	if (desktopWidth.matches) {
		switch (numberOfColumns) {
			case '1':
				postsWraper.style.gridTemplateColumns = '50%';
				break;
			case '2':
				postsWraper.style.gridTemplateColumns = '40% 40%';
				break;
			case '3':
				postsWraper.style.gridTemplateColumns = '30% 30% 30%';
				width1300.addEventListener('change', checkWidth1300);
				break;
			case '4':
				postsWraper.style.gridTemplateColumns = '20% 20% 20% 20%';
				width1300.addEventListener('change', checkWidth1300);
				break;
			case '5':
				postsWraper.style.gridTemplateColumns = '18% 18% 18% 18% 18%';
				width1300.addEventListener('change', checkWidth1300);
				break;
			default:
				postsWraper.style.gridTemplateColumns =
					'repeat(auto-fill, minmax(400px, 10px))';
		}
		checkWidth1300();
	}
});
