(function () {
  let tmpZipCode = '';
  /* eslint-disable no-unused-vars */
  function validateFields(frm, fields) {
  /* eslint-enable no-unused-vars */
    if (frm.length > 0) {
      $.each(fields, (index, key) => {
        if ($(`input[name=${key}]`).length > 0 && $(`input[name=${key}]`).val() !== '') {
          let phoneNumber = $('input[name=phoneNumber]').val();
          switch (key) {
            case 'postalCode':
              if ($(`input[name=${key}]`).val() !== tmpZipCode) {
                tmpZipCode = $(`input[name=${key}]`).val();
                loadStateFromZip();
              }
              break;
            case 'phoneNumber':
              if (phoneNumber.length === 10 && phoneNumber.indexOf('-') < 0) {
                phoneNumber = `${phoneNumber.substr(0, 3)}-${phoneNumber.substr(3, 3)}-${phoneNumber.substr(6)}`;
                $('input[name=phoneNumber]').val(phoneNumber);
                frm.formValidation('revalidateField', 'phoneNumber');
              }
              break;
            default:
              frm.formValidation('revalidateField', key);
          }
        }
      });
    }
  }
}());
