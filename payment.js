document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    const price = urlParams.get('price');
    const services = urlParams.get('services');

    // Update the order summary
    document.getElementById('plan-name').textContent = plan || 'No plan selected';
    document.getElementById('plan-price').textContent = price || 'EGP0.00';
    
    // Store order details globally
    window.orderDetails = {
        plan: plan || 'No plan selected',
        price: price || 'EGP0.00',
        services: services || 'No services specified'
    };
    
    // Check if it's a verification plan or currency top-up plan
    const isVerificationPlan = plan && plan.toLowerCase().includes('verification');
    const isCurrencyTopUpPlan = plan && plan.toLowerCase().includes('top-up');
    const isChatGPTPersonalPlan = plan && plan.toLowerCase().includes('chatgpt premium personal account');
    const isReadyAccountPlan = plan && (plan.toLowerCase().includes('ready account') || plan.toLowerCase().includes('canva pro') || plan.toLowerCase().includes('capcut'));
    
    // Show/hide appropriate form fields
    const contentLinkGroup = document.getElementById('content-link-group');
    const accountDetailsGroup = document.getElementById('account-details-group');
    const accountPasswordGroup = document.getElementById('account-password-group');
    const phoneNumberGroup = document.getElementById('phone-number-group');
    const accountIdGroup = document.getElementById('account-id-group');
    
    if (isVerificationPlan) {
        // For verification plans, show email, password, phone
        contentLinkGroup.style.display = 'none';
        accountDetailsGroup.style.display = 'block';
        accountPasswordGroup.style.display = 'block';
        phoneNumberGroup.style.display = 'block';
        accountIdGroup.style.display = 'none';
    } else if (isCurrencyTopUpPlan) {
        // For currency top-up plans, show only account ID
        contentLinkGroup.style.display = 'none';
        accountDetailsGroup.style.display = 'none';
        accountPasswordGroup.style.display = 'none';
        phoneNumberGroup.style.display = 'none';
        accountIdGroup.style.display = 'block';
    } else if (isChatGPTPersonalPlan) {
        // For ChatGPT Personal Account plans, show only email
        contentLinkGroup.style.display = 'none';
        accountDetailsGroup.style.display = 'block';
        accountPasswordGroup.style.display = 'none';
        phoneNumberGroup.style.display = 'none';
        accountIdGroup.style.display = 'none';
    } else if (isReadyAccountPlan) {
        // For ready/pre-activated accounts, show no additional fields
        contentLinkGroup.style.display = 'none';
        accountDetailsGroup.style.display = 'none';
        accountPasswordGroup.style.display = 'none';
        phoneNumberGroup.style.display = 'none';
        accountIdGroup.style.display = 'none';
    } else {
        // For boosting plans, show content link
        contentLinkGroup.style.display = 'block';
        accountDetailsGroup.style.display = 'none';
        accountPasswordGroup.style.display = 'none';
        phoneNumberGroup.style.display = 'none';
        accountIdGroup.style.display = 'none';
    }

    // Payment method buttons
    const paymentButtons = document.querySelectorAll('.payment-option');
    const paymentDetails = document.getElementById('payment-details');
    const orderDetails = document.getElementById('order-details');

    // Payment details for each method
    const paymentInfo = {
        etisalat: {
            title: 'Etisalat Cash Payment',
            details: 'Please send the payment to: 01107297090\n\nAfter sending, please contact us with the transaction ID.',
            contact: '01107297090'
        },
        payeer: {
            title: 'Payeer Payment',
            details: 'Please send the payment to Payeer account:\n\nP1134460784\n\nAfter sending, please contact us with the transaction ID.',
            contact: 'P1134460784'
        }
    };

    // Add click event listeners to payment buttons
    paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            paymentButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get payment method from button class
            const method = button.classList[1]; // vodafone, etisalat, etc.
            
            // Display payment details
            const info = paymentInfo[method];
            paymentDetails.innerHTML = `
                <div class="payment-info">
                    <h4>${info.title}</h4>
                    <p>Amount to Pay: <span class="price">${price}</span></p>
                    <p>${info.details}</p>
                    <div class="wallet-address">
                        ${info.contact}
                    </div>
                </div>
            `;
            
            // Show payment details section
            paymentDetails.classList.add('active');
            
            // Show order details form
            orderDetails.style.display = 'block';
        });
    });

    // File upload preview
    const fileInput = document.getElementById('screenshot-upload');
    const filePreview = document.getElementById('file-preview');
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                filePreview.innerHTML = `
                    <div class="preview-container">
                        <img src="${e.target.result}" alt="Payment Screenshot Preview" class="preview-image">
                        <p class="file-name">${file.name}</p>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        } else {
            filePreview.innerHTML = '';
        }
    });
});

// WhatsApp submission function
function submitOrder() {
    const screenshotFile = document.getElementById('screenshot-upload').files[0];
    const orderNotes = document.getElementById('order-notes').value;
    
    // Check if it's a verification plan or currency top-up plan
    const isVerificationPlan = window.orderDetails.plan && window.orderDetails.plan.toLowerCase().includes('verification');
    const isCurrencyTopUpPlan = window.orderDetails.plan && window.orderDetails.plan.toLowerCase().includes('top-up');
    const isChatGPTPersonalPlan = window.orderDetails.plan && window.orderDetails.plan.toLowerCase().includes('chatgpt premium personal account');
    const isReadyAccountPlan = window.orderDetails.plan && (window.orderDetails.plan.toLowerCase().includes('ready account') || window.orderDetails.plan.toLowerCase().includes('canva pro') || window.orderDetails.plan.toLowerCase().includes('capcut'));
    
    let validationError = '';
    let orderDetails = '';
    
    if (isVerificationPlan) {
        // For verification plans, get account details
        const accountEmail = document.getElementById('account-email').value;
        const accountPassword = document.getElementById('account-password').value;
        const phoneNumber = document.getElementById('phone-number').value;
        
        // Validation for verification plans
        if (!accountEmail) validationError = 'Please enter your account email';
        else if (!accountPassword) validationError = 'Please enter your account password';
        else if (!phoneNumber) validationError = 'Please enter your phone number';
        
        // Prepare account details for message
        orderDetails = `📧 *Account Email:* ${accountEmail}\n🔒 *Account Password:* ${accountPassword}\n📱 *Phone Number:* ${phoneNumber}`;
    } else if (isCurrencyTopUpPlan) {
        // For currency top-up plans, get account ID
        const accountId = document.getElementById('account-id').value;
        
        // Validation for currency top-up plans
        if (!accountId) validationError = 'Please enter your account ID';
        
        // Prepare account ID for message
        orderDetails = `🆔 *Account ID:* ${accountId}`;
    } else if (isChatGPTPersonalPlan) {
        // For ChatGPT Personal Account plans, get only email
        const accountEmail = document.getElementById('account-email').value;
        
        // Validation for ChatGPT Personal Account plans
        if (!accountEmail) validationError = 'Please enter your email address';
        
        // Prepare email for message
        orderDetails = `📧 *Email Address:* ${accountEmail}`;
    } else if (isReadyAccountPlan) {
        // For ready/pre-activated accounts, no additional information needed
        orderDetails = `✅ *Ready Account:* No additional information required`;
    } else {
        // For boosting plans, get content link
        const contentLink = document.getElementById('content-link').value;
        
        // Validation for boosting plans
        if (!contentLink) validationError = 'Please enter the content link';
        
        // Prepare content link for message
        orderDetails = `🔗 *Content Link:* ${contentLink}`;
    }
    
    if (validationError) {
        alert(validationError);
        return;
    }
    
    if (!screenshotFile) {
        alert('Please upload a payment screenshot');
        return;
    }
    
    // Check current language
    const currentLang = localStorage.getItem('language') || 'en';
    
    // Prepare order message based on language
    const orderMessage = currentLang === 'ar' ? `
🎯 *طلب جديد - SOCIAL PRO*

📋 *تفاصيل الطلب:*
• الخطة: ${window.orderDetails.plan}
• السعر: ${window.orderDetails.price}
• الخدمات: ${window.orderDetails.services}

${isVerificationPlan ? 
`📧 *البريد الإلكتروني للحساب:* ${document.getElementById('account-email').value}
🔒 *كلمة مرور الحساب:* ${document.getElementById('account-password').value}
📱 *رقم الهاتف:* ${document.getElementById('phone-number').value}` :
isCurrencyTopUpPlan ?
`🆔 *معرف الحساب:* ${document.getElementById('account-id').value}` :
isChatGPTPersonalPlan ?
`📧 *البريد الإلكتروني:* ${document.getElementById('account-email').value}` :
isReadyAccountPlan ?
`✅ *حساب جاهز:* لا توجد معلومات إضافية مطلوبة` :
`🔗 *رابط المحتوى:* ${document.getElementById('content-link').value}`}

📝 *ملاحظات إضافية:*
${orderNotes || 'لا توجد'}

⏰ *وقت الطلب:* ${new Date().toLocaleString()}

📸 *مهم: يرجى إرفاق لقطة شاشة الدفع مع هذه المحادثة*

---
يرجى معالجة هذا الطلب. شكراً لك!
    `.trim() : `
🎯 *NEW ORDER - SOCIAL PRO*

📋 *Order Details:*
• Plan: ${window.orderDetails.plan}
• Price: ${window.orderDetails.price}
• Services: ${window.orderDetails.services}

${isVerificationPlan ? 
`📧 *Account Email:* ${document.getElementById('account-email').value}
🔒 *Account Password:* ${document.getElementById('account-password').value}
📱 *Phone Number:* ${document.getElementById('phone-number').value}` :
isCurrencyTopUpPlan ?
`🆔 *Account ID:* ${document.getElementById('account-id').value}` :
isChatGPTPersonalPlan ?
`📧 *Email Address:* ${document.getElementById('account-email').value}` :
isReadyAccountPlan ?
`✅ *Ready Account:* No additional information required` :
`🔗 *Content Link:* ${document.getElementById('content-link').value}`}

📝 *Additional Notes:*
${orderNotes || 'None'}

⏰ *Order Time:* ${new Date().toLocaleString()}

📸 *IMPORTANT: Please attach the payment screenshot to this conversation*

---
Please process this order. Thank you!
    `.trim();
    
    // WhatsApp phone number
    const whatsappNumber = '201107297090';
    
    // Create WhatsApp URL with message
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show success message with instructions based on language
    const alertMessage = currentLang === 'ar' ? 
        'واتساب يفتح مع رسالة طلبك.\n\nخطوات مهمة:\n1. ستكون رسالة الطلب مملوءة مسبقاً\n2. انقر على زر المرفق (📎) في واتساب\n3. اختر "الكاميرا" أو "المعرض"\n4. اختر لقطة شاشة الدفع\n5. أرسل الرسالة مع لقطة الشاشة\n\nسيتم معالجة طلبك بمجرد إرسال الرسالة ولقطة الشاشة!' :
        'WhatsApp is opening with your order message.\n\nIMPORTANT STEPS:\n1. The order message will be pre-filled\n2. Click the attachment button (📎) in WhatsApp\n3. Select "Camera" or "Gallery"\n4. Choose your payment screenshot\n5. Send the message with the screenshot\n\nYour order will be processed once you send both the message and screenshot!';
    
    alert(alertMessage);
}