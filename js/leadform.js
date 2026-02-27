/**
 * Lead-Formular – Direkte Brevo-Integration (kein Backend noetig)
 *
 * Nutzt den Brevo JavaScript Tracker um Kontakte direkt
 * aus dem Browser an Brevo zu uebergeben.
 */

(function () {
    'use strict';

    var BREVO_CLIENT_KEY = '8wu1qch8jjsjqow1so5ik23n';
    var FUNNEL_TAG = 'Industry_Brief_ASE';
    var MIN_SUBMIT_TIME_MS = 2000;
    var PAGE_LOAD_TIME = Date.now();

    // ── BREVO TRACKER LADEN ──────────────────────────────────

    var trackerScript = document.createElement('script');
    trackerScript.src = 'https://cdn.brevo.com/js/sdk-loader.js';
    trackerScript.async = true;
    document.head.appendChild(trackerScript);

    window.Brevo = window.Brevo || [];
    Brevo.push(['init', { client_key: BREVO_CLIENT_KEY }]);

    // ── DOM ──────────────────────────────────────────────────

    var form = document.getElementById('leadForm');
    var submitBtn = document.getElementById('submitBtn');
    var btnText = submitBtn.querySelector('.btn-text');
    var btnLoading = submitBtn.querySelector('.btn-loading');
    var successMessage = document.getElementById('successMessage');
    var errorMessage = document.getElementById('errorMessage');
    var errorText = document.getElementById('errorText');

    var fields = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('email'),
        company: document.getElementById('company'),
        position: document.getElementById('position'),
        website: document.getElementById('website'),
        gdprConsent: document.getElementById('gdprConsent'),
        consentText: document.getElementById('consentText'),
    };

    // ── VALIDIERUNG ──────────────────────────────────────────

    function validateField(input, errorId, rules) {
        var errorEl = document.getElementById(errorId);
        var value = input.value.trim();
        var msg = '';

        if (rules.required && !value) {
            msg = 'Dieses Feld ist erforderlich.';
        } else if (rules.minLength && value.length < rules.minLength) {
            msg = 'Mindestens ' + rules.minLength + ' Zeichen erforderlich.';
        } else if (rules.pattern && !rules.pattern.test(value)) {
            msg = rules.patternMsg || 'Ungueltiges Format.';
        } else if (rules.isEmail && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
            msg = 'Bitte eine gueltige E-Mail-Adresse eingeben.';
        }

        if (msg) {
            input.classList.add('invalid');
            if (errorEl) errorEl.textContent = msg;
            return false;
        }
        input.classList.remove('invalid');
        if (errorEl) errorEl.textContent = '';
        return true;
    }

    var namePattern = /^[a-zA-ZäöüÄÖÜßéèêàáâ\s\-'.]+$/;

    function validateForm() {
        var ok = [
            validateField(fields.firstName, 'firstNameError', {
                required: true, minLength: 2, pattern: namePattern,
                patternMsg: 'Nur Buchstaben, Bindestriche und Apostrophe erlaubt.',
            }),
            validateField(fields.lastName, 'lastNameError', {
                required: true, minLength: 2, pattern: namePattern,
                patternMsg: 'Nur Buchstaben, Bindestriche und Apostrophe erlaubt.',
            }),
            validateField(fields.email, 'emailError', { required: true, isEmail: true }),
        ];

        var consentErr = document.getElementById('consentError');
        if (!fields.gdprConsent.checked) {
            if (consentErr) consentErr.textContent = 'Bitte stimmen Sie der Datenverarbeitung zu.';
            ok.push(false);
        } else {
            if (consentErr) consentErr.textContent = '';
            ok.push(true);
        }

        return ok.every(Boolean);
    }

    // ── ABSENDEN ─────────────────────────────────────────────

    function handleSubmit(e) {
        e.preventDefault();
        if (!validateForm()) return;

        // Honeypot
        if (fields.website.value) { showSuccess(); return; }

        // Timing-Check
        if (Date.now() - PAGE_LOAD_TIME < MIN_SUBMIT_TIME_MS) { showSuccess(); return; }

        setLoading(true);
        hideError();

        var email = fields.email.value.trim().toLowerCase();
        var firstName = fields.firstName.value.trim();
        var lastName = fields.lastName.value.trim();
        var company = fields.company.value.trim();
        var position = fields.position.value.trim();

        try {
            // Kontakt in Brevo erstellen/aktualisieren
            Brevo.push(function () {
                Brevo.identify({
                    identifiers: { email_id: email },
                    attributes: {
                        VORNAME: firstName,
                        NACHNAME: lastName,
                        FIRMA: company || '',
                        POSITION: position || '',
                        LEAD_SOURCE: 'AS Electronic Industry Brief',
                        FUNNEL_TAG: FUNNEL_TAG,
                        GDPR_CONSENT: true,
                        CONSENT_DATE: new Date().toISOString(),
                    }
                });
            });

            // Event fuer Brevo Automation
            Brevo.push(function () {
                Brevo.track('whitepaper_request', {
                    tag: FUNNEL_TAG,
                    first_name: firstName,
                    last_name: lastName,
                    company: company,
                });
            });

            setTimeout(function () {
                setLoading(false);
                showSuccess();
                trackConversion();
            }, 1500);

        } catch (err) {
            console.error('[LeadGen] Fehler:', err);
            setLoading(false);
            showError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        }
    }

    // ── UI ───────────────────────────────────────────────────

    function setLoading(on) {
        submitBtn.disabled = on;
        btnText.style.display = on ? 'none' : 'inline';
        btnLoading.style.display = on ? 'inline-flex' : 'none';
    }

    function showSuccess() {
        form.style.display = 'none';
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showError(msg) {
        errorMessage.style.display = 'block';
        errorText.textContent = msg;
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    function trackConversion() {
        if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', { event_category: 'whitepaper', event_label: FUNNEL_TAG });
        }
        console.log('[LeadGen] Conversion tracked');
    }

    // ── LIVE VALIDATION ──────────────────────────────────────

    fields.firstName.addEventListener('blur', function () {
        validateField(fields.firstName, 'firstNameError', { required: true, minLength: 2, pattern: namePattern });
    });
    fields.lastName.addEventListener('blur', function () {
        validateField(fields.lastName, 'lastNameError', { required: true, minLength: 2, pattern: namePattern });
    });
    fields.email.addEventListener('blur', function () {
        validateField(fields.email, 'emailError', { required: true, isEmail: true });
    });

    form.addEventListener('submit', handleSubmit);
    console.log('[LeadGen] Formular initialisiert (Direkte Brevo-Integration)');
})();
