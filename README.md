# Movienizer UI

## Functional Description
The project is UI for Movienizer database. At the time of writing this provides read only search capability.

Search results are made available in a paginated table.

### Filters Above the Movies Table
1. Global Search edit box - text field that executes Full Text Search in all movie fields. At the backend this is implemented with Apache Lucene in-memory directory.
2. Director/Writer/Actor multiple object auto-complete - this input allows to search movies by people involved in them. Multiple people can be added to search with this input field. The autocomplete uses Lucene Full Text Search to look up people but when searching for movies an exact match is expected.
3. Genre multiple selection drop down - the drop down allows selecting genres of interest.
4. Country multiple selection drop down - lets pick countries to which the movies are attributed.

Note: search criteria 2-4 each has an input switch that toggles between 'All' and 'Any'. This controls what happens if the input has multiple values (e.g. multiple actors). 'All' means searching for movies that have all matching values (e.g. all selected actors). 'Any' means the search finds movies where at least one value is matched our of multiple (e.g. at least one actor out of the selected).

### Filters in the Table Header
Each column has a filter in the header:

5. Title and Original Title fields have regular edit boxes.
6. Year, Kinopoisk Rating, IMDB Rating and Duration columns have slider that allow to choose a range of values.
7. The Year filter in addition to slider also has number inputs above the slider that become active if the user focuses in them. This is helpful since years range over more than a century and precise year selection with a slider is not possible over so many possible values. Beware that due a known Microsoft Edge bug these number inputs do not fire events and will not work correctly until Microsoft fixes the bug in Edge. Chrome and FireFox work as expected.

### Sorting and Search Results Scoring
Clicking on a column header gives control to the user over how the data in the Movies table is sorted. Clicking on a header toggles between three states:

1. No column sorting
2. Ascending
3. Descending

If none of the columns defines results sorting the results are by default sorted as follows:

1. If none of the filters above the Movies table have values then the results are ordered by Title column in ascending order.
2. If at least one value is specified in the filters above the Movies table the results are sorted by ranking.

Ranking:

1. Global Search text ranking is done by Full Text Search algorithm and is meant to rank by closest match (e.g. more token matches found).
2. Other filters above the Movies table are ranked by percentage of exact matches. E.g. if the user selected 3 actors and the movie has 2 out of 3 actors then ranking will be 2/3 = 0.666(6).
3. Each filter has equal weight and thus compound ranking is just a sum of each filter rankins.

### Text Highlight
Because Global Search looks through all movie fields it may sometimes be difficult to understand why a movie was selected - especially if the matches are found in long texts like Movie Description field (shows in expandable in-table area). To make it easier to see matching pieces such matches are highlighted in the text. Highlighting works only for Global Search filter and not any other filters.

### Expandable in-table Movie Details
Clicking on an icon in the first column opens expandable area with further movie details. Those movie details contain such fields as Description, Awards, Budget, Directors, Writers Actors. If the field has no value it is not shown. Each such field can in turn be collapsed/expanded by clicking on the field header.

### Links to Kinopoisk.ru
The movie, Directors, Writers and Actors all have links to their kinopoisk pages. Such pages are open in a new browser tab.

### Reset
Reset button below the Movies table resets all filters and sorting.

## Angular CLI

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.18.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
