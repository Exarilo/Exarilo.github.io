const cardTagsList = [];

function filterCards() {
    const languageFilters = document.querySelectorAll('input[name="language"]:checked');
    const progressFilters = document.querySelectorAll('input[name="progress"]:checked');
    const accessibilityFilters = document.querySelectorAll('input[name="repoStatus"]:checked');
    const difficultyFilters = document.querySelectorAll('input[name="rating"]:checked');

    const languageFiltersArray = Array.from(languageFilters);
    languageFiltersArray.forEach((langage) => {
        langage.value = langage.value === "csharp" ? "C#" : langage.value;
    });    
    const progressFiltersArray = Array.from(progressFilters);
    const accessibilityFiltersArray = Array.from(accessibilityFilters);
    const difficultyValue = difficultyFilters.length===0?"all":difficultyFilters[0].value;

    cardTagsList.forEach((cardInfo) => {
        const cardElement = cardInfo.cardElement;
        const languageTags = cardInfo.languageTags;
        const progressTag = cardInfo.progressTag;
        const difficultyTag = cardInfo.difficultyTag;
        const privacyTag = cardInfo.privacyTag;

        const isVisibleLanguage = languageFiltersArray.length === 0 || languageTags.some(tag => languageFiltersArray.some(filter => filter.value.toLowerCase() === tag.toLowerCase()));
        const isVisibleProgress = progressFiltersArray.length === 0 || progressFiltersArray.some(filter => filter.value.toLowerCase() === progressTag.toLowerCase());
        const isVisibleDifficulty = (difficultyValue === "all" || (difficultyTag && difficultyTag[0] === difficultyValue)) || false;
        const isVisibleAccessibility = accessibilityFiltersArray.length === 0 || accessibilityFiltersArray.some(filter => filter.value?.toLowerCase() === privacyTag?.toLowerCase());
        cardElement.style.display = (isVisibleLanguage && isVisibleProgress && isVisibleDifficulty && isVisibleAccessibility) ? 'block' : 'none';
    });
}

function attachFilterEvents() {
    const languageCheckboxes = document.querySelectorAll('input[name="language"]');
    const progressCheckboxes = document.querySelectorAll('input[name="progress"]');
    const difficultyRadios = document.querySelectorAll('input[name="rating"]');
    const accessibilityCheckboxes = document.querySelectorAll('input[name="repoStatus"]');

    [...languageCheckboxes, ...progressCheckboxes, ...difficultyRadios, ...accessibilityCheckboxes].forEach(input => {
        input.addEventListener('change', filterCards);
    });

    const allRatingCheckbox = document.getElementById('AllRating');
    allRatingCheckbox.addEventListener('change', () => {
        if (allRatingCheckbox.checked) {
            difficultyRadios.forEach(radio => {
                radio.checked = false;
            });
        }
        filterCards();
    });
}

function associateTagsWithCards() {
    const projectCards = document.querySelectorAll('.card');

    projectCards.forEach((card) => {
        const languageTags = Array.from(card.querySelectorAll('.tag.language')).map(tag => tag.textContent);
        const progressTag = card.querySelector('.tag.progression')?.textContent || null;
        const difficultyTag = card.querySelector('.tag.difficulty')?.textContent || null;
        var privacyTag = card.querySelector('.tag.privacy')?.textContent === '\uD83D\uDD12' ? "private" : "public";

        cardTagsList.push({
            cardElement: card,
            languageTags: languageTags,
            progressTag: progressTag,
            difficultyTag: difficultyTag,
            privacyTag: privacyTag 
        });
    });
}

function difficultyClickHandler() {
    const ratingDiv = document.querySelector('.rating');
    const allRatingCheckbox = document.querySelector('#AllRating');
  
    allRatingCheckbox.addEventListener('click', () => {
      if (!allRatingCheckbox.checked) {
        ratingDiv.querySelectorAll('input[type="radio"]').forEach(radioBtn => {
          radioBtn.checked = false;
        });
      }
      allRatingCheckbox.checked=true;
    });
  
    ratingDiv.querySelectorAll('input[type="radio"]').forEach(radioBtn => {
      radioBtn.addEventListener('click', () => {
        allRatingCheckbox.checked = false;
      });
    });
  }


  function filterCardsBySearchTerm() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const projectCards = document.querySelectorAll('.card');
    projectCards.forEach((card) => {
        const projectName = card.querySelector('h2').textContent.toLowerCase();
        if (projectName.includes(searchInput)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
  }
  
  function init() {
      const searchInput = document.getElementById('searchInput');
      searchInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
              filterCardsBySearchTerm();
          }
      });
      const publicFilterCheckbox = document.querySelector('input[name="repoStatus"][value="public"]');
      if (publicFilterCheckbox) {
          publicFilterCheckbox.checked = true;
      }
  
  
      document.getElementById('searchButton').addEventListener('click', filterCardsBySearchTerm);
      associateTagsWithCards();
      attachFilterEvents();
      difficultyClickHandler()
      filterCards(); 

  }
  


document.addEventListener('DOMContentLoaded', init);
