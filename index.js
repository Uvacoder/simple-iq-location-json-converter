$(document).ready(function () {

  $('#json-form').on('submit', (e) => {
    e.preventDefault();
    let value = $('#json-textarea').val().trim();

    if (!value && !isJSON(value.toString())) {
      $('#json-form .form-group').addClass('has-error');
      $('#json-form .help-block').html('Invalid JSON');
    }
    else {
      $('#json-form .form-group').removeClass('has-error');
      $('#json-form .help-block').html('');

      generateTable(JSON.parse(value));
    }

  });

});


function defaultCategories() {
  let categories = ['Address', 'StorePhoneNumbers', 'Name', 'Id'];
  return categories;
}

function fetchLocation(locations, categories) {
  categories = categories || defaultCategories();

  return locations.map(location => {
    let {AddressLine1, City, StateName, CountryName, Zip} = location.Address;

    return categories.reduce((prev, cat) => {
      if (cat === 'Address') {
        prev[cat] = `${AddressLine1}, ${City} ${StateName} ${CountryName} ${Zip}`;
      }
      else if (cat === 'StorePhoneNumbers') {
        if (location.StorePhoneNumbers[0]) {
          prev[cat] = `${location.StorePhoneNumbers[0].Number}`;
        }
      }
      else {
        prev[cat] = location[cat];
      }
      return prev;
    }, {});

  });
}

function generateTable(locations) {
  let categories = defaultCategories();
  let locs = fetchLocation(locations);

  let header = categories.reduce((prev, cur) => {
    if (cur === 'Id') {
      prev += `<th>LocationId</th>`;
    } else {
      prev += `<th>${cur}</th>`;
    }
    return prev;
  }, '');
  $('#csv-test').html(`<thead><tr>${header}</tr></thead>`);

  let body = '';
  for (let loc of locs) {
    body += '<tr>';
    for (let key in loc) {
      body += `<td>${loc[key]}</td>`;
    }
    body += '</tr>';
  }
  $('#csv-test').append(`<tbody>${body}</tbody>`);
}

function selectElementContents(el) {
    var body = document.body, range, sel;
    if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
            range.selectNodeContents(el);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(el);
            sel.addRange(range);
        }
    } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
}
