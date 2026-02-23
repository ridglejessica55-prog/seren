import React from 'react';
import { motion } from 'motion/react';
import { User, Stethoscope, Pill, ShieldCheck, ExternalLink, Phone, MapPin, Users, Building2, Activity } from 'lucide-react';

const professionals = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    type: 'Therapist',
    specialty: 'Addiction & Trauma',
    icon: User,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    id: '2',
    name: 'Dr. James Wilson',
    type: 'Psychiatrist',
    specialty: 'Medication Management',
    icon: Stethoscope,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    id: '3',
    name: 'Marcus Rivera',
    type: 'Social Worker',
    specialty: 'Housing & Employment',
    icon: Users,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    id: '4',
    name: 'Main St. Pharmacy',
    type: 'Pharmacist',
    specialty: 'Recovery Support',
    icon: Pill,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  }
];

const insurancePartners = [
  { name: 'Blue Shield', coverage: 'Full Mental Health', logo: '🛡️' },
  { name: 'Aetna', coverage: 'Recovery Programs', logo: '🏥' },
  { name: 'UnitedHealth', coverage: 'Telehealth Support', logo: '🌐' },
];

const detoxCenters = [
  {
    id: 'd1',
    name: 'Incura Rehab & Detox',
    location: 'San Francisco, CA',
    specialty: 'Medical Detox & Residential',
    phone: '1-800-INCURA',
    rating: '4.9',
  },
  {
    id: 'd2',
    name: 'Serenity Springs',
    location: 'Austin, TX',
    specialty: 'Holistic Recovery',
    phone: '1-800-SERENE',
    rating: '4.8',
  },
  {
    id: 'd3',
    name: 'Beacon Health Detox',
    location: 'Miami, FL',
    specialty: 'Acute Withdrawal Mgmt',
    phone: '1-800-BEACON',
    rating: '4.7',
  }
];

export const CareNetwork = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-4xl h-[80vh] bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
    >
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
        <div>
          <h2 className="text-xl font-light tracking-widest uppercase">Care Network</h2>
          <p className="text-[10px] text-blue-400/60 uppercase tracking-widest font-bold">Professional Support & Insurance</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ShieldCheck className="w-6 h-6 text-white/40" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-12 scrollbar-hide">
        {/* Professionals Section */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-6">Verified Professionals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {professionals.map((pro) => (
              <motion.div
                key={pro.id}
                whileHover={{ y: -5 }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-4 group"
              >
                <div className={`w-12 h-12 rounded-xl ${pro.bg} flex items-center justify-center`}>
                  <pro.icon className={`w-6 h-6 ${pro.color}`} />
                </div>
                <div>
                  <h4 className="font-medium text-white/90">{pro.name}</h4>
                  <p className="text-xs text-white/40">{pro.type} • {pro.specialty}</p>
                </div>
                <div className="pt-4 flex gap-2">
                  <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-colors">Profile</button>
                  <button className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
                    <Phone className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Insurance Section */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-6">Insurance Partners</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insurancePartners.map((partner) => (
              <div key={partner.name} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{partner.logo}</div>
                  <div>
                    <h4 className="font-medium text-white/90">{partner.name}</h4>
                    <p className="text-xs text-white/40">{partner.coverage}</p>
                  </div>
                </div>
                <button className="p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Detox & Rehab Section */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Detox & Rehab Centers</h3>
            <button className="text-[10px] text-blue-400 uppercase tracking-widest font-bold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {detoxCenters.map((center) => (
              <motion.div
                key={center.id}
                whileHover={{ y: -5 }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-white/90">{center.name}</h4>
                    <div className="flex items-center gap-1 text-[10px] text-amber-400">
                      <Activity className="w-3 h-3" /> {center.rating}
                    </div>
                  </div>
                  <p className="text-[10px] text-white/40 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {center.location}
                  </p>
                  <p className="text-xs text-white/60 mt-2">{center.specialty}</p>
                </div>
                <div className="pt-2">
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-3 h-3" /> Contact Center
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pharmacy & Meds */}
        <section className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-3xl">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h3 className="text-lg font-light mb-2">Prescription Support</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Connect with our network of specialized pharmacists who understand recovery journeys. We help coordinate with your insurance for seamless medication management.
              </p>
            </div>
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs uppercase tracking-widest font-bold transition-all shadow-lg shadow-blue-600/20">
              Find a Pharmacy
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
