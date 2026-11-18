// // js/payments.js
// document.addEventListener('DOMContentLoaded', () => {
//   let selectedFrequency = 'One-Time Donation';
//   let selectedProvider = 'MTN'; // 'MTN' or 'AIRTEL'
//   let currentAmount = 25000;

//   const freqButtons = document.querySelectorAll('.freq-btn');
//   const presetAmtButtons = document.querySelectorAll('.preset-amt-btn');
//   const customAmountInput = document.getElementById('custom-amount');
//   const amountImpactHint = document.getElementById('amount-impact-hint');
//   const providerMtnBtn = document.getElementById('provider-mtn');
//   const providerAirtelBtn = document.getElementById('provider-airtel');
//   const donorPhoneInput = document.getElementById('donor-phone');
//   const programSelect = document.getElementById('program-select');
//   const submitBtnLabel = document.getElementById('submit-btn-label');
//   const formErrorBox = document.getElementById('form-error-box');
//   const formErrorText = document.getElementById('form-error-text');


// // Automatic international phone number detection
// const iti = window.intlTelInput(donorPhoneInput, {
//   initialCountry: "auto",
//   separateDialCode: true,
//   nationalMode: true,
//   autoPlaceholder: "polite",

//   geoIpLookup: async (success, failure) => {
//     try {
//       const response = await fetch("https://ipapi.co/json/");

//       if (!response.ok) throw new Error("Location detection failed");

//       const data = await response.json();

//       success(data.country_code
//         ? data.country_code.toLowerCase()
//         : "ug"
//       );

//     } catch (error) {
//       success("ug"); // Default to Uganda if detection fails
//     }
//   },

//   loadUtils: () =>
//     import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js")
// });


//   // Add this inside js/payments.js
// const currencySelect = document.getElementById('currency-select'); // Or your country/currency dropdown

// // Country code mapping based on currency or network selection
// const countryPrefixMap = {
//     'UGX': { code: '256', placeholder: '256771234567', label: 'Uganda (+256)' },
//     'ZMW': { code: '260', placeholder: '260961234567', label: 'Zambia (+260)' },
//     'KES': { code: '254', placeholder: '254712345678', label: 'Kenya (+254)' },
//     'GHS': { code: '233', placeholder: '233241234567', label: 'Ghana (+233)' }
// };

// if (currencySelect && donorPhoneInput) {
//     currencySelect.addEventListener('change', (e) => {
//         const selectedCurrency = e.target.value;
//         const config = countryPrefixMap[selectedCurrency] || { code: '', placeholder: 'Enter phone with country code' };
        
//         // Update placeholder dynamically
//         donorPhoneInput.placeholder = config.placeholder;
        
//         // Optional: If the input is empty or starts with an old prefix, auto-suggest or update helper text
//         console.log(`Switched currency to ${selectedCurrency}, expected prefix: ${config.code}`);
//     });
// }

//   function formatUGX(val) {
//     const num = Math.max(0, Math.round(Number(val) || 0));
//     return 'UGX ' + num.toLocaleString('en-US');
//   }

//   function showToast(message) {
//     const toast = document.getElementById('toast-msg');
//     if (!toast) return;
//     toast.textContent = message;
//     toast.classList.remove('hidden');
//     setTimeout(() => toast.classList.add('hidden'), 2800);
//   }

//   window.selectProgramPreset = function (programValue) {
//     if (programSelect) programSelect.value = programValue;
//   };

//   function updateDonationUI() {
//     const amt = Math.max(0, Number(customAmountInput.value) || 0);
//     currentAmount = amt;

//     const charityShare = Math.round(amt * 0.85);
//     const opsShare = amt - charityShare;

//     const bTotal = document.getElementById('breakdown-total');
//     const bCharity = document.getElementById('breakdown-charity');
//     const bOps = document.getElementById('breakdown-ops');

//     if (bTotal) bTotal.textContent = formatUGX(amt);
//     if (bCharity) bCharity.textContent = formatUGX(charityShare);
//     if (bOps) bOps.textContent = formatUGX(opsShare);

//     const providerLabel = selectedProvider === 'MTN' ? 'MTN MoMo' : 'Airtel Money';
//     if (submitBtnLabel) {
//       submitBtnLabel.textContent = `Send ${providerLabel} Prompt • ${formatUGX(amt)}`;
//     }
//   }

//   freqButtons.forEach((btn) => {
//     btn.addEventListener('click', () => {
//       selectedFrequency = btn.dataset.freq;
//       freqButtons.forEach((b) => {
//         b.classList.remove('bg-ncfPurple', 'text-white', 'shadow', 'font-extrabold');
//         b.classList.add('text-gray-700', 'font-bold');
//       });
//       btn.classList.add('bg-ncfPurple', 'text-white', 'shadow', 'font-extrabold');
//       btn.classList.remove('text-gray-700', 'font-bold');
//     });
//   });

//   presetAmtButtons.forEach((btn) => {
//     btn.addEventListener('click', () => {
//       customAmountInput.value = Number(btn.dataset.amount);
//       presetAmtButtons.forEach((b) => {
//         b.classList.remove('border-ncfPurple', 'bg-ncfPurple-light', 'text-ncfPurple', 'font-extrabold');
//         b.classList.add('border-gray-200', 'text-gray-800', 'font-bold');
//       });
//       btn.classList.add('border-ncfPurple', 'bg-ncfPurple-light', 'text-ncfPurple', 'font-extrabold');
//       btn.classList.remove('border-gray-200', 'text-gray-800', 'font-bold');
//       updateDonationUI();
//     });
//   });

//   if (customAmountInput) customAmountInput.addEventListener('input', updateDonationUI);
//   if (donorPhoneInput) donorPhoneInput.addEventListener('input', updateDonationUI);

//   function setProvider(provider) {
//     selectedProvider = provider;
//     if (provider === 'MTN') {
//       providerMtnBtn.classList.add('border-mtnYellow', 'bg-[#FFFDF0]', 'shadow-sm');
//       providerMtnBtn.classList.remove('border-gray-200', 'bg-white');
//       providerAirtelBtn.classList.remove('border-airtelRed', 'bg-red-50/40', 'shadow-sm');
//       providerAirtelBtn.classList.add('border-gray-200', 'bg-white');
//       donorPhoneInput.placeholder = '771234567';
//     } else {
//       providerAirtelBtn.classList.add('border-airtelRed', 'bg-red-50/40', 'shadow-sm');
//       providerAirtelBtn.classList.remove('border-gray-200', 'bg-white');
//       providerMtnBtn.classList.remove('border-mtnYellow', 'bg-[#FFFDF0]', 'shadow-sm');
//       providerMtnBtn.classList.add('border-gray-200', 'bg-white');
//       donorPhoneInput.placeholder = '701234567';
//     }
//     updateDonationUI();
//   }

//   if (providerMtnBtn) providerMtnBtn.addEventListener('click', () => setProvider('MTN'));
//   if (providerAirtelBtn) providerAirtelBtn.addEventListener('click', () => setProvider('AIRTEL'));

//   // ===================================================================
//   // REAL PAWAPAY BACKEND SUBMISSION (Replaces Simulation with Live Deposit)
//   // ===================================================================
//   const donationForm = document.getElementById('donation-form');
//   if (donationForm) {
//     donationForm.addEventListener('submit', async (e) => {
//       e.preventDefault();
//       // const phoneVal = donorPhoneInput.value.trim();

//       // if (!phoneVal || phoneVal.length < 10) {
//       //   if (formErrorBox && formErrorText) {
//       //     formErrorBox.classList.remove('hidden');
//       //     formErrorText.textContent = 'Please enter a valid mobile number with country code (e.g. 256771234567).';
//       //   }
//       //   donorPhoneInput.focus();
//       //   return;
//       // }
//       // if (formErrorBox) formErrorBox.classList.add('hidden');

//       // Map selected provider to PawaPay correspondent code & currency
      
// // Get the complete international phone number
// const phoneVal = iti.getNumber().replace(/^\+/, "");

// // Validate the phone number
// if (!donorPhoneInput.value.trim() || !iti.isValidNumber()) {
//   if (formErrorBox && formErrorText) {
//     formErrorBox.classList.remove('hidden');
//     formErrorText.textContent =
//       'Please enter a valid mobile money number.';
//   }

//   donorPhoneInput.focus();
//   return;
// }

// if (formErrorBox) formErrorBox.classList.add('hidden');

      
      
//       const correspondent = selectedProvider === 'MTN' ? 'MTN_MOMO_UGA' : 'AIRTEL_OAPI_UGA';
//       const currency = 'UGX';
//       const description = (programSelect ? programSelect.value : 'NCF Donation') + ` (${selectedFrequency})`;

//       // Show processing state in modal or toast
//       const modal = document.getElementById('payment-modal');
//       const spinner = document.getElementById('sim-loading-spinner');
//       const step1 = document.getElementById('sim-step-1');
//       const step2 = document.getElementById('sim-step-2');

//       if (modal) {
//         document.getElementById('modal-provider-name').textContent = selectedProvider === 'MTN' ? 'MTN Mobile Money (Uganda)' : 'Airtel Money (Uganda)';
//         document.getElementById('modal-amount-display').textContent = formatUGX(currentAmount);
//         document.getElementById('modal-phone-display').textContent = '+' + phoneVal;
//         if (spinner) spinner.classList.remove('hidden');
//         if (step1) step1.classList.remove('hidden');
//         if (step2) step2.classList.add('hidden');
//         modal.classList.remove('hidden');
//         modal.classList.add('flex');
//       }

//       try {
//         // Send request to your backend Node server
//         const response = await fetch('/api/donate/pawapay', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             amount: currentAmount,
//             currency: currency,
//             correspondent: correspondent,
//             phone: phoneVal,
//             description: description
//           })
//         });

//         const result = await response.json();

//         if (spinner) spinner.classList.add('hidden');

//         if (result.success) {
//           if (step1) step1.classList.add('hidden');
//           if (step2) {
//             step2.classList.remove('hidden');
//             step2.innerHTML = `
//               <div class="text-center py-4">
//                 <div class="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">✓</div>
//                 <h4 class="font-extrabold text-gray-900 text-lg">Deposit Initiated Successfully!</h4>
//                 <p class="text-xs text-gray-600 mt-1">Deposit ID: <code class="bg-gray-100 px-1 py-0.5 rounded text-ncfPurple">${result.depositId}</code></p>
//                 <p class="text-xs text-green-700 font-semibold mt-2">Check your PawaPay Sandbox Dashboard now—this transaction will reflect as Accepted/Completed!</p>
//               </div>
//             `;
//           }
//           showToast('PawaPay deposit successfully initiated!');
//         } else {
//           if (step2) {
//             step2.classList.remove('hidden');
//             step2.innerHTML = `
//               <div class="text-center py-4">
//                 <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">✕</div>
//                 <h4 class="font-extrabold text-gray-900 text-lg">Deposit Rejected</h4>
//                 <p class="text-xs text-red-600 mt-1">${JSON.stringify(result.error || 'Unknown error')}</p>
//               </div>
//             `;
//           }
//         }
//       } catch (err) {
//         if (spinner) spinner.classList.add('hidden');
//         if (step2) {
//           step2.classList.remove('hidden');
//           step2.innerHTML = `
//             <div class="text-center py-4">
//               <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">✕</div>
//               <h4 class="font-extrabold text-gray-900 text-lg">Network Error</h4>
//               <p class="text-xs text-red-600 mt-1">Could not reach backend server.</p>
//             </div>
//           `;
//         }
//       }
//     });
//   }

//   updateDonationUI();
// });
































// js/payments.js

document.addEventListener('DOMContentLoaded', () => {

  let selectedFrequency = 'One-Time Donation';
  let selectedProvider = 'MTN';
  let currentAmount = 25000;
  let isSubmitting = false;

  const freqButtons = document.querySelectorAll('.freq-btn');
  const presetAmtButtons = document.querySelectorAll('.preset-amt-btn');
  const customAmountInput = document.getElementById('custom-amount');
  const amountImpactHint = document.getElementById('amount-impact-hint');
  const providerMtnBtn = document.getElementById('provider-mtn');
  const providerAirtelBtn = document.getElementById('provider-airtel');
  const donorPhoneInput = document.getElementById('donor-phone');
  const programSelect = document.getElementById('program-select');
  const submitBtn = document.getElementById('donate-submit-btn');
  const submitBtnLabel = document.getElementById('submit-btn-label');
  const formErrorBox = document.getElementById('form-error-box');
  const formErrorText = document.getElementById('form-error-text');

  const donationForm = document.getElementById('donation-form');

  // =========================================================
  // INTERNATIONAL PHONE NUMBER DETECTION
  // =========================================================

  let iti = null;

  if (donorPhoneInput && typeof window.intlTelInput === 'function') {

    iti = window.intlTelInput(donorPhoneInput, {
      initialCountry: 'auto',
      separateDialCode: true,
      nationalMode: true,
      autoPlaceholder: 'polite',
      preferredCountries: ['ug', 'ke', 'tz', 'rw', 'us', 'gb'],

      geoIpLookup: async (success) => {
        try {
          const response = await fetch('https://ipapi.co/json/');

          if (!response.ok) {
            throw new Error('Country detection failed');
          }

          const data = await response.json();

          success(
            data.country_code
              ? data.country_code.toLowerCase()
              : 'ug'
          );

        } catch (error) {
          console.warn('Country detection failed:', error);
          success('ug');
        }
      },

      loadUtils: () =>
        import('https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js')
    });

  } else {
    console.warn('International phone library unavailable. Using Uganda fallback.');
  }

  // =========================================================
  // GENERAL FUNCTIONS
  // =========================================================

  function formatUGX(val) {
    const num = Math.max(0, Math.round(Number(val) || 0));
    return 'UGX ' + num.toLocaleString('en-US');
  }

  function showToast(message) {
    const toast = document.getElementById('toast-msg');

    if (!toast) {
      console.log(message);
      return;
    }

    toast.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2800);
  }

  function showFormError(message) {
    if (formErrorBox && formErrorText) {
      formErrorBox.classList.remove('hidden');
      formErrorText.textContent = message;
    } else {
      showToast(message);
    }
  }

  function clearFormError() {
    if (formErrorBox) {
      formErrorBox.classList.add('hidden');
    }
  }

  window.selectProgramPreset = function (programValue) {
    if (programSelect) {
      programSelect.value = programValue;
    }
  };

  // =========================================================
  // DONATION AMOUNT DISPLAY
  // =========================================================

  function updateDonationUI() {

    const amt = Math.max(
      0,
      Number(customAmountInput?.value) || 0
    );

    currentAmount = amt;

    const charityShare = Math.round(amt * 0.85);
    const opsShare = amt - charityShare;

    const bTotal = document.getElementById('breakdown-total');
    const bCharity = document.getElementById('breakdown-charity');
    const bOps = document.getElementById('breakdown-ops');

    if (bTotal) bTotal.textContent = formatUGX(amt);
    if (bCharity) bCharity.textContent = formatUGX(charityShare);
    if (bOps) bOps.textContent = formatUGX(opsShare);

    const providerLabel =
      selectedProvider === 'MTN' ? 'MTN MoMo' : 'Airtel Money';

    if (submitBtnLabel) {
      submitBtnLabel.textContent =
        `Send ${providerLabel} Prompt • ${formatUGX(amt)}`;
    }
  }

  // =========================================================
  // DONATION FREQUENCY
  // =========================================================

  freqButtons.forEach((btn) => {

    btn.addEventListener('click', () => {

      selectedFrequency = btn.dataset.freq || 'One-Time Donation';

      freqButtons.forEach((b) => {
        b.classList.remove(
          'bg-ncfPurple',
          'text-white',
          'shadow',
          'font-extrabold'
        );

        b.classList.add('text-gray-700', 'font-bold');
      });

      btn.classList.add(
        'bg-ncfPurple',
        'text-white',
        'shadow',
        'font-extrabold'
      );

      btn.classList.remove('text-gray-700', 'font-bold');

    });

  });

  // =========================================================
  // PRESET DONATION AMOUNTS
  // =========================================================

  presetAmtButtons.forEach((btn) => {

    btn.addEventListener('click', () => {

      if (customAmountInput) {
        customAmountInput.value = Number(btn.dataset.amount);
      }

      presetAmtButtons.forEach((b) => {

        b.classList.remove(
          'border-ncfPurple',
          'bg-ncfPurple-light',
          'text-ncfPurple',
          'font-extrabold'
        );

        b.classList.add(
          'border-gray-200',
          'text-gray-800',
          'font-bold'
        );

      });

      btn.classList.add(
        'border-ncfPurple',
        'bg-ncfPurple-light',
        'text-ncfPurple',
        'font-extrabold'
      );

      btn.classList.remove(
        'border-gray-200',
        'text-gray-800',
        'font-bold'
      );

      updateDonationUI();

    });

  });

  if (customAmountInput) {
    customAmountInput.addEventListener('input', updateDonationUI);
  }

  // =========================================================
  // MOBILE MONEY PROVIDER SELECTION
  // =========================================================

  function setProvider(provider) {

    selectedProvider = provider;

    if (provider === 'MTN') {

      if (providerMtnBtn) {
        providerMtnBtn.classList.add(
          'border-mtnYellow',
          'bg-[#FFFDF0]',
          'shadow-sm'
        );

        providerMtnBtn.classList.remove(
          'border-gray-200',
          'bg-white'
        );
      }

      if (providerAirtelBtn) {
        providerAirtelBtn.classList.remove(
          'border-airtelRed',
          'bg-red-50/40',
          'shadow-sm'
        );

        providerAirtelBtn.classList.add(
          'border-gray-200',
          'bg-white'
        );
        
      }
      donorPhoneInput.placeholder = '782534567';

    } else {

      if (providerAirtelBtn) {
        providerAirtelBtn.classList.add(
          'border-airtelRed',
          'bg-red-50/40',
          'shadow-sm'
        );

        providerAirtelBtn.classList.remove(
          'border-gray-200',
          'bg-white'
        );
      }

      if (providerMtnBtn) {
        providerMtnBtn.classList.remove(
          'border-mtnYellow',
          'bg-[#FFFDF0]',
          'shadow-sm'
        );

        providerMtnBtn.classList.add(
          'border-gray-200',
          'bg-white'
        );
      }
      donorPhoneInput.placeholder = '702635987';
    }

    updateDonationUI();
  }

  if (providerMtnBtn) {
    providerMtnBtn.addEventListener('click', () => {
      setProvider('MTN');
    });
  }

  if (providerAirtelBtn) {
    providerAirtelBtn.addEventListener('click', () => {
      setProvider('AIRTEL');
    });
  }

  // =========================================================
  // PHONE NUMBER VALIDATION
  // =========================================================

  async function getPhoneNumber() {

    if (!donorPhoneInput || !donorPhoneInput.value.trim()) {
      throw new Error('Please enter your mobile money number.');
    }

    let phoneVal = '';

    if (iti) {

      // Wait for the international phone utilities to load.
      if (iti.promise) {
        await iti.promise;
      }

      const country = iti.getSelectedCountryData();

      // The current PawaPay backend supports Uganda only.
      if (!country || country.iso2 !== 'ug') {
        throw new Error(
          'Please select Uganda (+256). Mobile Money payments are currently configured for Uganda.'
        );
      }

      if (!iti.isValidNumber()) {
        throw new Error('Please enter a valid Ugandan mobile number.');
      }

      phoneVal = iti.getNumber().replace(/^\+/, '');

    } else {

      // Fallback when the international phone library is unavailable.
      let digits = donorPhoneInput.value.replace(/\D/g, '');

      if (digits.startsWith('256')) {
        phoneVal = digits;
      } else {

        if (digits.startsWith('0')) {
          digits = digits.substring(1);
        }

        phoneVal = '256' + digits;
      }

      if (!/^256[0-9]{9}$/.test(phoneVal)) {
        throw new Error(
          'Enter a valid Ugandan number, e.g. 775698545.'
        );
      }

    }

    if (!/^256[0-9]{9}$/.test(phoneVal)) {
      throw new Error('Invalid Ugandan mobile number.');
    }

    return phoneVal;
  }

  // =========================================================
  // PAWAPAY DONATION SUBMISSION
  // =========================================================

  if (donationForm) {

    donationForm.addEventListener('submit', async (e) => {

      e.preventDefault();

      if (isSubmitting) return;

      clearFormError();

      let phoneVal;

      try {

        phoneVal = await getPhoneNumber();

      } catch (error) {

        showFormError(error.message);

        if (donorPhoneInput) {
          donorPhoneInput.focus();
        }

        return;
      }

      if (!currentAmount || currentAmount <= 0) {
        showFormError('Please enter a valid donation amount.');
        return;
      }

      // PawaPay Uganda correspondent configuration.
      const correspondent =
        selectedProvider === 'MTN'
          ? 'MTN_MOMO_UGA'
          : 'AIRTEL_OAPI_UGA';

      const currency = 'UGX';

      const description =
        (programSelect ? programSelect.value : 'NCF Donation') +
        ` (${selectedFrequency})`;

      // Payment modal elements.
      const modal = document.getElementById('payment-modal');
      const spinner = document.getElementById('sim-loading-spinner');
      const step1 = document.getElementById('sim-step-1');
      const step2 = document.getElementById('sim-step-2');

      const modalProviderName =
        document.getElementById('modal-provider-name');

      const modalAmountDisplay =
        document.getElementById('modal-amount-display');

      const modalPhoneDisplay =
        document.getElementById('modal-phone-display');

      // Show payment processing modal.
      if (modal) {

        if (modalProviderName) {
          modalProviderName.textContent =
            selectedProvider === 'MTN'
              ? 'MTN Mobile Money (Uganda)'
              : 'Airtel Money (Uganda)';
        }

        if (modalAmountDisplay) {
          modalAmountDisplay.textContent = formatUGX(currentAmount);
        }

        if (modalPhoneDisplay) {
          modalPhoneDisplay.textContent = '+' + phoneVal;
        }

        if (spinner) spinner.classList.remove('hidden');
        if (step1) step1.classList.remove('hidden');
        if (step2) step2.classList.add('hidden');

        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }

      // Disable button during payment request.
      isSubmitting = true;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-60', 'cursor-not-allowed');
      }

      if (submitBtnLabel) {
        submitBtnLabel.textContent = 'Processing donation...';
      }

      try {

        const response = await fetch('/api/donate/pawapay', {

          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            amount: currentAmount,
            currency: currency,
            correspondent: correspondent,
            phone: phoneVal,
            description: description
          })

        });

        const result = await response.json();

        if (spinner) {
          spinner.classList.add('hidden');
        }

        if (!response.ok || !result.success) {

          if (step1) {
            step1.classList.add('hidden');
          }

          if (step2) {

            step2.classList.remove('hidden');

            step2.innerHTML = `
              <div class="text-center py-4">
                <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">✕</div>

                <h4 class="font-extrabold text-gray-900 text-lg">
                  Deposit Rejected
                </h4>

                <p class="text-xs text-red-600 mt-1">
                  ${result.error || 'Unable to initiate payment. Please try again.'}
                </p>
              </div>
            `;

          } else {

            showFormError(
              result.error || 'Unable to initiate payment. Please try again.'
            );

          }

          return;
        }

        // Payment request successfully initiated.
        if (step1) {
          step1.classList.add('hidden');
        }

        if (step2) {

          step2.classList.remove('hidden');

          step2.innerHTML = `
            <div class="text-center py-4">

              <div class="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                ✓
              </div>

              <h4 class="font-extrabold text-gray-900 text-lg">
                Deposit Initiated Successfully!
              </h4>

              <p class="text-xs text-gray-600 mt-1">
                Deposit ID:
                <code class="bg-gray-100 px-1 py-0.5 rounded text-ncfPurple">
                  ${result.depositId || 'Pending'}
                </code>
              </p>

              <p class="text-xs text-green-700 font-semibold mt-2">
                Please check your phone for the Mobile Money payment prompt.
              </p>

            </div>
          `;

        }

        showToast('PawaPay deposit successfully initiated!');

      } catch (err) {

        console.error('PawaPay payment error:', err);

        if (spinner) {
          spinner.classList.add('hidden');
        }

        if (step1) {
          step1.classList.add('hidden');
        }

        if (step2) {

          step2.classList.remove('hidden');

          step2.innerHTML = `
            <div class="text-center py-4">

              <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                ✕
              </div>

              <h4 class="font-extrabold text-gray-900 text-lg">
                Network Error
              </h4>

              <p class="text-xs text-red-600 mt-1">
                Could not reach the payment server. Please try again.
              </p>

            </div>
          `;

        } else {

          showFormError('Could not reach the payment server. Please try again.');

        }

      } finally {

        isSubmitting = false;

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
        }

        updateDonationUI();

      }

    });

  } else {
    console.error('Donation form not found. Check id="donation-form".');
  }

  // =========================================================
  // INITIAL PAGE STATE
  // =========================================================

  if (customAmountInput && customAmountInput.value) {
    currentAmount = Number(customAmountInput.value) || 25000;
  }

  updateDonationUI();

  console.log('NCF donation payment system initialized.');

});


// =========================================================
// PAYMENT MODAL CLOSE FUNCTIONALITY
// =========================================================

const paymentModal = document.getElementById('payment-modal');

function closePaymentModal() {
  if (!paymentModal) return;

  paymentModal.classList.add('hidden');
  paymentModal.classList.remove('flex');
}

// Close using any button with data-close-modal.
document.addEventListener('click', (event) => {
  const closeButton = event.target.closest('[data-close-modal]');

  if (closeButton) {
    event.preventDefault();
    closePaymentModal();
  }
});

// Close when clicking the dark background outside the modal.
if (paymentModal) {
  paymentModal.addEventListener('click', (event) => {
    if (event.target === paymentModal) {
      closePaymentModal();
    }
  });
}

// Close using the Escape key.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && paymentModal) {
    closePaymentModal();
  }
});
