this.onFieldChange = function onFieldChange() {
  if (document.getElementById('input-nom').value !== ''
          && document.getElementById('input-prenom').value !== ''
          && document.getElementById('input-tel').value !== '') {
    document.getElementById('btn-enregistrer').disabled = false;
  }
};
