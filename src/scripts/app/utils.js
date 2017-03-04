const md = new MobileDetect(window.navigator.userAgent);
/* eslint-disable no-unused-vars */
function customWrapperForIsMobileDevice() {
/* eslint-enable no-unused-vars */
  if (md.mobile() || md.phone() || md.tablet()) {
    return true;
  }
  return false;
}

function isJsonObj(obj) {
  return typeof obj === 'object';
}
// check if a string is a valid json data
function isValidJson(str) {
  if (str === '') {
    return false;
  }
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/* eslint-disable no-unused-vars */
function getJson(e) {
/* eslint-enable no-unused-vars */
  let json = {};
  if (isJsonObj(e)) {
    json = e;
  } else if (isValidJson(e)) {
    json = JSON.parse(e);
  }
  return json;
}

// call API
function callAPI(endpoint, data, method, callback, err) {
  let ApiUrl = `/api/v2/${endpoint}/`;
  const params = {
    endpoint,
    data,
    method,
    callback,
    err,
  };

  params[method] = method || 'POST';
  // if data is an array pass as post,
  // otherwise the string is a simple get and needs to append to the end of the uri
  if (data && data.constructor !== Object) {
    ApiUrl += data;
    params[data] = null;
  }

  // https://starlightgroup.atlassian.net/browse/SG-14
  if (['PUT', 'POST', 'PATCH', 'DELETE'].indexOf(method) !== -1) {
    /* eslint-disable no-underscore-dangle */
    params[data]._csrf = $.cookie('XSRF-TOKEN');
    console.log(`COOKIE(token): ${params[data]._csrf}`);
    /* eslint-enable no-underscore-dangle */
  } else {
    console.log('COOKIE(token): -');
  }

  jQuery.ajax({
    method: params[method],
    url: ApiUrl,
    data: params[data],
    beforeSend(xhr) { xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); },
  }).done((msg) => {
    if (typeof params[callback] === 'function') {
      params[callback](msg);
    }
  }).fail((jqXHR, textStatus) => {
    if (typeof params[err] === 'function') {
      params[err](textStatus);
    }
    console.log(`error occured on api - ${params[endpoint]}`);
    console.log(`error11 - ${textStatus}`);
  });
}
// load state from zipcode
/* eslint-disable no-unused-vars */
function loadStateFromZip() {
/* eslint-enable no-unused-vars */
  const fZip = $('#zipcode');
  const fZipVal = fZip.val();
  const params = [];
  if (fZipVal.length === 5) {
    fZip.addClass('processed');
    $('#state, #city').prop('disabled', true);
    $('#state + small + i, #city + small + i').show();
    callAPI(`state/${fZipVal}`, params, 'GET', (resp) => {
      const jData = resp.data;
      if (resp.success) {
        if (jData.city !== undefined && jData.city !== '' && jData.city !== null) {
          $('#city').val(jData.city);
        } else {
          $('#city').val('');
        }

        if (jData.state !== undefined && jData.state !== '' && jData.state !== null) {
          $('#state').val(jData.state).trigger('change');
        } else {
          $('#state').val('');
        }
        $('input[name=address1]').focus();
      }
      // remove fa spin icons and do formvalidation
      $('#state, #city').prop('disabled', false);
      let frm;
      if ($('#form-address').length > 0) {
        frm = $('#form-address');
      } else {
        frm = $('#checkoutForm');
      }
      frm.formValidation('revalidateField', 'city');
      frm.formValidation('revalidateField', 'state');
    });
  }
}
// Detects safari with Applewebkit only
/* eslint-disable no-unused-vars */
function isMobileSafari() {
/* eslint-enable no-unused-vars */
  return navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);
}
function bootstrapModal(content, title) {
  const modal = $('#tm-modal');
  // set content
  modal.find('.modal-body').html(content);
  if (title !== null) {
    modal.find('.modal-title').text(title);
  } else {
    modal.find('.modal-title').text('');
  }
  // open modal
  modal.modal('show');
}
function popPage(pageURL, title) {
  jQuery.ajax({
    method: 'GET',
    url: pageURL,
  }).done((msg) => {
    bootstrapModal(msg, title);
  });
}
// Terms and privacy popups
/* eslint-disable no-unused-vars */
function termsModal(e) {
  popPage('terms.html', 'Terms & Conditions');
}
function partnerModal(e) {
  popPage('partner.html', 'Partner');
}
function privacyModal(e) {
  popPage('privacy.html', 'Privacy Policy');
}
function pressModal(e) {
  popPage('press.html');
}
function custcareModal(e) {
  popPage('customercare.html', 'Customer Care');
}
/* eslint-enable no-unused-vars */
function getQueryVariable(variable) {
  for (let i = 0; i < window.location.search.substring(1).split('&').length; i + 1) {
    const pair = window.location.search.substring(1).split('&')[i].split('=');
    if (pair[0] === variable) {
      console.log('url check-------->', pair);
      return pair[1];
    }
  }
  return '';
}
/* eslint-disable no-unused-vars */
function afGet(field, qsField) {
/* eslint-enable no-unused-vars */
  const params = {
    field,
    qsFiled,
  };

  params[qsField] = qsField || false;
  let returnThis;
  if (params[qsField]) {
    const qParam = getQueryVariable(params[qsField]);
    if (qParam !== '') {
      returnThis = qParam;
    }
  }
  if (returnThis) {
    return returnThis.replace(/[+]/g, ' ');
  }
  return returnThis;
}
function getStorageItem(k) {
  return localStorage.getItem(k);
}
/* eslint-disable no-unused-vars */
function getOrderData() {
/* eslint-enable no-unused-vars */
  const keys = [
    'orderId',
    'firstName',
    'lastName',
    'emailAddress',
    'phoneNumber',
    'address1',
    'city',
    'state',
    'postalCode',
    'cardNumber',
    'cardSecurityCode',
    'cardMonth',
    'cardYear',
    'productId',
  ];
  const obj = {};
  // for (const k in keys) {
  //   if (keys.hasOwnProperty(k)) {
  //     obj[keys[k]] = getStorageItem(keys[k]) || '';
  //   }
  // }

  Object.values(keys).forEach((value) => { obj[value] = getStorageItem(value) || ''; });

  return obj;
}
/* eslint-disable no-unused-vars */
function clearStorageItem(k) {
/* eslint-enable no-unused-vars */
  localStorage.removeItem(k);
}
/* eslint-disable no-unused-vars */
function escapeHTML(str) {
/* eslint-enable no-unused-vars */
  const params = {
    str,
  };

  params[str] = `${params[str]}`;
  let out = '';
  for (let i = 0; i < params[str].length; i + 1) {
    if (params[str][i] === '<') {
      out += '&lt;';
    } else if (params[str][i] === '>') {
      out += '&gt;';
    } else if (params[str][i] === "'") {
      out += '&#39;';
    } else if (params[str][i] === '"') {
      out += '&quot;';
    } else {
      out += params[str][i];
    }
  }
  return out;
}
