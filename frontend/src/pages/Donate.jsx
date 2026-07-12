import React from 'react';
import { Heart, CreditCard, Gift, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Donate = () => {
    const [customAmount, setCustomAmount] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [donorName, setDonorName] = React.useState('');
    const [donorEmail, setDonorEmail] = React.useState('');
    const [donorContact, setDonorContact] = React.useState('');
    const [donorPan, setDonorPan] = React.useState('');
    const [formErrors, setFormErrors] = React.useState({});
    const [formMessage, setFormMessage] = React.useState({ type: '', text: '' });

    const [programs, setPrograms] = React.useState([]);

    React.useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/causes`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setPrograms(data.causes.filter(c => c.is_active));
                }
            })
            .catch(err => console.error("Error fetching causes:", err));
    }, []);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const validateField = (name, value) => {
        let error = '';
        if (name === 'name' && !value.trim()) error = 'Name is required';
        if (name === 'email' && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) error = 'Valid email is required';
        if (name === 'contact' && !value.trim()) error = 'Phone number is required';
        if (name === 'pan') {
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (!value.trim()) error = 'PAN number is required';
            else if (!panRegex.test(value.toUpperCase())) error = 'Invalid PAN format (e.g. ABCDE1234F)';
        }
        setFormErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    const handlePayment = async (amount) => {
        setFormMessage({ type: '', text: '' });
        
        const nameError = validateField('name', donorName);
        const emailError = validateField('email', donorEmail);
        const contactError = validateField('contact', donorContact);
        const panError = validateField('pan', donorPan);

        if (nameError || emailError || contactError || panError) {
            setFormMessage({ type: 'error', text: 'Please fix the errors in your details before proceeding.' });
            window.scrollTo({ top: 300, behavior: 'smooth' });
            return;
        }
        setLoading(true);
        const res = await loadRazorpayScript();

        if (!res) {
            setFormMessage({ type: 'error', text: 'Payment SDK failed to load. Are you online?' });
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order
            const orderResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/payment/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, name: donorName, email: donorEmail, contact: donorContact, pan_number: donorPan.toUpperCase() }),
            });
            
            const orderData = await orderResponse.json();
            
            if (!orderData.success) {
                setFormMessage({ type: 'error', text: 'Server error creating order. Please try again later.' });
                setLoading(false);
                return;
            }

            // 2. Open Razorpay Checkout
            const keyResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/payment/key`);
            const keyData = await keyResponse.json();
            
            const options = {
                key: keyData.key,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "Samikaran NGO",
                description: "Donation for a Cause",
                image: "/logo.webp", // Using the logo from public folder
                order_id: orderData.order.id,
                handler: async function (response) {
                    // 3. Verify Payment
                    const verifyResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/payment/verify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }),
                    });

                    const verifyData = await verifyResponse.json();

                    if (verifyData.success) {
                        setFormMessage({ type: 'success', text: 'Payment Successful! Thank you for your generous donation.' });
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                    } else {
                        setFormMessage({ type: 'error', text: 'Payment verification failed. Please contact support.' });
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                    }
                },
                prefill: {
                    name: donorName,
                    email: donorEmail,
                    contact: donorContact
                },
                notes: {
                    address: "Samikaran Office"
                },
                theme: {
                    color: "#F37254"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            setFormMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
            window.scrollTo({ top: 300, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-primary text-white py-16 text-center rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black/10" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-5xl font-bold mb-4">Make a Difference</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Your small contribution can create a massive impact. 100% of your donation goes directly to the cause.
            </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto border border-gray-100">
            
            {formMessage.text && (
                <div className={`mb-8 p-4 rounded-xl border font-medium flex items-center gap-3 ${formMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {formMessage.type === 'success' ? <CheckCircle size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-red-500 text-red-500 font-bold flex items-center justify-center text-xs">!</div>}
                    {formMessage.text}
                </div>
            )}

            <div className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">1. Your Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <input type="text" placeholder="Full Name" value={donorName} onChange={e => { setDonorName(e.target.value); validateField('name', e.target.value); }} className={`w-full p-4 bg-white rounded-xl font-medium outline-none border focus:ring-1 ${formErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'}`} />
                        {formErrors.name && <p className="text-red-500 text-sm mt-1 px-1">{formErrors.name}</p>}
                    </div>
                    <div>
                        <input type="email" placeholder="Email Address" value={donorEmail} onChange={e => { setDonorEmail(e.target.value); validateField('email', e.target.value); }} className={`w-full p-4 bg-white rounded-xl font-medium outline-none border focus:ring-1 ${formErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'}`} />
                        {formErrors.email && <p className="text-red-500 text-sm mt-1 px-1">{formErrors.email}</p>}
                    </div>
                    <div>
                        <input type="tel" placeholder="Phone Number" value={donorContact} onChange={e => { setDonorContact(e.target.value); validateField('contact', e.target.value); }} className={`w-full p-4 bg-white rounded-xl font-medium outline-none border focus:ring-1 ${formErrors.contact ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'}`} />
                        {formErrors.contact && <p className="text-red-500 text-sm mt-1 px-1">{formErrors.contact}</p>}
                    </div>
                    <div>
                        <input type="text" placeholder="PAN Number" value={donorPan} onChange={e => { setDonorPan(e.target.value.toUpperCase()); validateField('pan', e.target.value); }} maxLength={10} className={`w-full p-4 bg-white rounded-xl font-medium outline-none border uppercase focus:ring-1 ${formErrors.pan ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'}`} />
                        {formErrors.pan && <p className="text-red-500 text-sm mt-1 px-1">{formErrors.pan}</p>}
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">2. Choose a Cause</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {programs.map(prog => (
                    <div key={prog.id} onClick={() => handlePayment(prog.amount)} className="border-2 border-transparent hover:border-primary bg-gray-50 p-6 rounded-xl cursor-pointer transition-all hover:bg-primary/10 group text-center flex flex-col h-full">
                        <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm text-primary mb-4 group-hover:scale-110 transition-transform">
                            <Gift size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{prog.title}</h3>
                        <p className="text-sm text-gray-500 mb-4 flex-1">{prog.description}</p>
                        <div className="text-lg font-bold text-primary mt-auto">₹{Number(prog.amount).toLocaleString()}</div>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <p className="text-gray-500 mb-6">Or enter a custom amount</p>
                <div className="flex gap-4 justify-center max-w-md mx-auto mb-8">
                    <span className="p-4 bg-gray-100 rounded-l-xl font-bold text-gray-500 text-xl">₹</span>
                    <input 
                        type="number" 
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Enter Amount" 
                        className="w-full p-4 bg-gray-100 rounded-r-xl font-bold text-xl outline-none focus:ring-2 focus:ring-primary" 
                    />
                </div>
                
                <button 
                    onClick={() => {
                        if (customAmount && customAmount > 0) handlePayment(customAmount);
                        else setFormMessage({ type: 'error', text: 'Please enter a valid amount' });
                    }}
                    disabled={loading}
                    className="w-full md:w-auto px-12 py-4 bg-secondary text-gray-900 font-bold text-xl rounded-full shadow-lg hover:brightness-90 hover:shadow-secondary/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : 'Proceed to Pay'} <ArrowRight size={24} />
                </button>
            </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            <div className="p-6">
                <CheckCircle className="mx-auto text-primary mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2">Tax Benefits</h3>
                <p className="text-gray-600">All donations are tax deductible under Section 80G.</p>
            </div>
            <div className="p-6">
                <Heart className="mx-auto text-primary mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
                <p className="text-gray-600">We use SSL encryption to ensure your data is safe.</p>
            </div>
            <div className="p-6">
                <CreditCard className="mx-auto text-primary mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2">Transparency</h3>
                <p className="text-gray-600">Receive regular updates on how your funds are used.</p>
            </div>
        </div>
      </div>
    </div>
  )
}
export default Donate;
