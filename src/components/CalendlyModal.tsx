import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock, CheckCircle2, MessageSquare, ArrowRight, Phone, Mail, User, Loader2, AlertCircle } from 'lucide-react';
import { CONTACT_INFO } from '../data/contactData';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendlyModal: React.FC<CalendlyModalProps> = ({ isOpen, onClose }) => {
  // Generate next available days excluding Sunday (Mon, Tue, Wed, Thu, Fri, Sat)
  const availableDates = useMemo(() => {
    const days: { label: string; date: string; fullString: string }[] = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let current = new Date();
    current.setDate(current.getDate() + 1); // Start tomorrow

    while (days.length < 6) {
      const dayOfWeek = current.getDay(); // 0 is Sunday
      if (dayOfWeek !== 0) { // Exclude Sunday
        const dayName = dayNames[dayOfWeek];
        const month = monthNames[current.getMonth()];
        const dateNum = current.getDate();
        const dateString = `${dayName.slice(0, 3)}, ${month} ${dateNum}`;
        days.push({
          label: dayName,
          date: dateString,
          fullString: `${dayName}, ${month} ${dateNum}`,
        });
      }
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, []);

  // Time slots every 30 minutes from 9:00 AM to 11:30 PM
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
    '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
  ];

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]?.fullString || 'Monday, Aug 10');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [step, setStep] = useState<'schedule' | 'form' | 'success'>('schedule');

  const [bookedSlots, setBookedSlots] = useState<Array<{ selectedDate: string; selectedTime: string }>>([]);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('Website Design');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch booked slots whenever modal opens or steps change
  const fetchBookedSlots = async () => {
    try {
      const res = await fetch('/api/booked-slots');
      if (res.ok) {
        const data = await res.json();
        if (data?.bookedSlots) {
          setBookedSlots(data.bookedSlots);
        }
      }
    } catch (err) {
      console.error('Failed to fetch booked slots:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBookedSlots();
    }
  }, [isOpen]);

  const isSlotBooked = (dateStr: string, timeStr: string) => {
    return bookedSlots.some(
      (slot) => slot.selectedDate === dateStr && slot.selectedTime === timeStr
    );
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBookingError(null);

    try {
      const res = await fetch('/api/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          selectedDate,
          selectedTime,
          projectType,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setBookingError(data.error || 'This slot is no longer available. Please select another time slot.');
        await fetchBookedSlots();
        setStep('schedule');
        return;
      }

      await fetchBookedSlots();
      setStep('success');
    } catch (err) {
      console.error('Booking API call error:', err);
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep('schedule');
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md"
        />

        {/* Modal Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-2xl bg-neutral-900 dark:bg-neutral-900 light:bg-stone-50 border border-neutral-800 dark:border-neutral-800 light:border-stone-300 rounded-2xl shadow-2xl overflow-hidden z-10 my-auto text-neutral-100 dark:text-neutral-100 light:text-neutral-900 max-h-[90vh] flex flex-col"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-neutral-950/90 dark:bg-neutral-950/90 light:bg-stone-100 border-b border-neutral-800 dark:border-neutral-800 light:border-stone-300 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                  Book 30-Min Discovery Call
                </h3>
                <p className="text-xs text-neutral-400">
                  With Precious Imonikhe • Free Project Consultation
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              id="close-calendly-modal-btn"
              className="p-2 rounded-full bg-neutral-800 dark:bg-neutral-800 light:bg-stone-200 text-neutral-400 hover:text-white dark:hover:text-white light:hover:text-black transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">

            {step === 'schedule' && (
              <div className="space-y-6">
                {bookingError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                    Step 1: Select Date & Time (Monday – Saturday)
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Select an available 30-minute slot between 9:00 AM and 11:30 PM. (Sundays excluded)
                  </p>
                </div>

                {/* Available Days (Monday to Saturday) */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                    Available Days (Mon – Sat):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {availableDates.map((item) => (
                      <button
                        key={item.fullString}
                        type="button"
                        onClick={() => {
                          setSelectedDate(item.fullString);
                          setBookingError(null);
                        }}
                        className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                          selectedDate === item.fullString
                            ? 'bg-amber-500 text-neutral-950 border-amber-400 font-semibold shadow-md'
                            : 'bg-neutral-950/60 dark:bg-neutral-950/60 light:bg-stone-100 border-neutral-800 dark:border-neutral-800 light:border-stone-300 text-neutral-300 dark:text-neutral-300 light:text-neutral-700 hover:border-neutral-700'
                        }`}
                      >
                        <span className="block font-bold">{item.label}</span>
                        <span className="block text-[10px] opacity-80 mt-0.5">{item.date}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 30-Minute Time Slot Selection (9:00 AM to 11:30 PM) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Select Available Time Slot (9:00 AM – 11:30 PM):</span>
                    </label>
                    <span className="text-[11px] text-amber-400 font-medium">
                      {isSlotBooked(selectedDate, selectedTime) ? 'Slot Unavailable' : selectedTime}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1.5 rounded-xl bg-neutral-950/50 border border-neutral-800/80">
                    {timeSlots.map((slot) => {
                      const booked = isSlotBooked(selectedDate, slot);
                      const isSelected = selectedTime === slot && !booked;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={booked}
                          onClick={() => {
                            if (!booked) {
                              setSelectedTime(slot);
                              setBookingError(null);
                            }
                          }}
                          className={`py-2 px-1.5 rounded-lg border text-center text-[11px] font-medium transition-all ${
                            booked
                              ? 'bg-neutral-950/40 border-neutral-900 text-neutral-600 line-through cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold shadow-md'
                              : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/60'
                          }`}
                        >
                          <span>{slot}</span>
                          {booked && <span className="block text-[9px] text-red-400/80 font-normal no-underline">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-neutral-800 dark:border-neutral-800 light:border-stone-300">
                  <a
                    href={CONTACT_INFO.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Prefer instant WhatsApp chat?</span>
                  </a>

                  <button
                    type="button"
                    disabled={isSlotBooked(selectedDate, selectedTime)}
                    onClick={() => {
                      if (!isSlotBooked(selectedDate, selectedTime)) {
                        setStep('form');
                      }
                    }}
                    id="calendly-continue-btn"
                    className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next: Enter Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                    Step 2: Contact & Project Information
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Selected Slot: <span className="font-semibold text-neutral-200">{selectedDate} at {selectedTime}</span>
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Marcus Vance"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-stone-300 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="marcus@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-stone-300 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                      Phone / WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-stone-300 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                      Primary Service Needed
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-stone-300 text-sm focus:outline-none focus:border-amber-400 text-neutral-200 dark:text-neutral-200 light:text-neutral-800"
                    >
                      <option value="Website Design">Website Design</option>
                      <option value="Website Redesign">Website Redesign</option>
                      <option value="Webflow / Wix Studio / WordPress">Webflow / Wix Studio / WordPress Build</option>
                      <option value="Landing Page">Landing Page</option>
                      <option value="SEO Strategy">SEO Strategy</option>
                      <option value="Branding & Logo Design">Branding & Logo Design</option>
                      <option value="Social Media Advertising">Social Media Advertising</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                      Additional Notes / Goals (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell me a bit about your business and goals..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-stone-300 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-neutral-800 dark:border-neutral-800 light:border-stone-300">
                  <button
                    type="button"
                    onClick={() => setStep('schedule')}
                    className="text-xs text-neutral-400 hover:text-white"
                  >
                    ← Back to Slots
                  </button>

                  <button
                    type="submit"
                    id="confirm-booking-btn"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Booking...</span>
                      </>
                    ) : (
                      <span>Confirm Discovery Call</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                  Discovery Call Confirmed!
                </h4>
                <p className="text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-amber-400">{name}</span>. Your discovery call for <span className="font-semibold">{selectedDate} at {selectedTime}</span> has been successfully scheduled.
                </p>

                <div className="p-4 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-stone-100 border border-neutral-800 text-xs text-neutral-400 space-y-1.5 max-w-sm mx-auto text-left">
                  <p className="flex items-center gap-1.5 text-neutral-200 font-semibold">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Confirmation emails sent to:</span>
                  </p>
                  <p className="pl-5 text-neutral-300">• Your email: <span className="text-amber-400 font-medium">{email}</span></p>
                  <p className="pl-5 text-neutral-300">• Precious Imonikhe: <span className="text-amber-400 font-medium">imonikheprecious6@gmail.com</span></p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleReset}
                    id="done-booking-btn"
                    className="px-6 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-100 light:bg-neutral-900 text-neutral-950 dark:text-neutral-950 light:text-white font-medium text-xs sm:text-sm"
                  >
                    Done & Return to Site
                  </button>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
