document.addEventListener('DOMContentLoaded', () => {
  const basePrice = 15.00;
  let total = basePrice;
  let draggedCharm = null;

  const totalDisplay = document.getElementById('total-display');
  const slots = document.querySelectorAll('.slot');
  const charms = document.querySelectorAll('.charm-item');
  const colorBtns = document.querySelectorAll('.color-btn');
  const pinStones = document.getElementById('pin-stones');
  const resetBtn = document.getElementById('reset-pin');

  // Kleur van de speld veranderen
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pinStones.setAttribute('fill', btn.dataset.color);
    });
  });

  // Functie om bedel toe te voegen aan een slot
  function addCharm(slot, charm) {
    if (!slot) return;
    if (slot.dataset.price) {
      total -= parseFloat(slot.dataset.price);
    }
    slot.innerHTML = charm.querySelector('svg').outerHTML;
    slot.dataset.price = charm.dataset.price;
    slot.classList.add('filled');
    total += parseFloat(charm.dataset.price);
    updatePrice();
  }

  // Klikken en slepen instellen voor bedels
  charms.forEach(charm => {
    charm.tabIndex = 0;
    charm.setAttribute('role', 'button');
    charm.setAttribute('aria-label', charm.dataset.id + ' toevoegen');
    
    const add = () => addCharm([...slots].find(s => !s.classList.contains('filled')), charm);
    charm.addEventListener('click', add);
    charm.addEventListener('keydown', e => { 
      if (e.key === 'Enter' || e.key === ' ') { 
        e.preventDefault(); 
        add(); 
      } 
    });

    charm.addEventListener('dragstart', () => {
      draggedCharm = {
        svg: charm.querySelector('svg').outerHTML,
        price: parseFloat(charm.dataset.price)
      };
    });
  });

  // Slots instellen voor droppen en verwijderen
  slots.forEach(slot => {
    slot.tabIndex = 0;
    slot.setAttribute('role', 'button');
    slot.setAttribute('aria-label', 'Bedelpositie ' + (Number(slot.dataset.index) + 1) + ', klik om bedel te verwijderen');
    
    slot.addEventListener('keydown', e => { 
      if (e.key === 'Enter' || e.key === ' ') { 
        e.preventDefault(); 
        slot.click(); 
      } 
    });

    slot.addEventListener('dragover', e => {
      e.preventDefault();
      slot.classList.add('drag-over');
    });

    slot.addEventListener('dragleave', () => {
      slot.classList.remove('drag-over');
    });

    slot.addEventListener('drop', e => {
      e.preventDefault();
      slot.classList.remove('drag-over');
      if (!draggedCharm) return;

      if (slot.dataset.price) {
        total -= parseFloat(slot.dataset.price);
      }

      slot.innerHTML = draggedCharm.svg;
      slot.dataset.price = draggedCharm.price;
      slot.classList.add('filled');

      total += draggedCharm.price;
      updatePrice();
      draggedCharm = null;
    });

    slot.addEventListener('click', () => {
      if (slot.classList.contains('filled')) {
        total -= parseFloat(slot.dataset.price);
        slot.innerHTML = '';
        delete slot.dataset.price;
        slot.classList.remove('filled');
        updatePrice();
      }
    });
  });

  // Alles wissen (Reset-knop)
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      slots.forEach(slot => {
        slot.innerHTML = '';
        delete slot.dataset.price;
        slot.classList.remove('filled');
      });
      total = basePrice;
      updatePrice();
    });
  }

  // Prijs bijwerken op het scherm
  function updatePrice() {
    totalDisplay.textContent = '€ ' + total.toFixed(2).replace('.', ',');
  }

  // Modal (bestelscherm) logica
  const modal = document.getElementById('order-modal');
  const openBtn = document.getElementById('open-modal');
  const closeBtn = document.getElementById('close-modal');
  const confirmBtn = document.getElementById('confirm-order');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => modal.classList.add('open'));
  }
  
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const name = document.getElementById('cust-name').value.trim();
      const email = document.getElementById('cust-email').value.trim();
      const address = document.getElementById('cust-address').value.trim();

      if (!name || !email || !address) {
        alert('Vul alstublieft alle velden in.');
        return;
      }
      modal.classList.remove('open');
      alert('Dit is een voorbeeldwebshop. Er is geen bestelling verstuurd en er is niets betaald.');
    });
  }
});