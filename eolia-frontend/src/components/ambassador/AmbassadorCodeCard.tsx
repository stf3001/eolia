import { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import type { Affiliate } from '../../types/affiliate';

interface AmbassadorCodeCardProps {
  affiliate: Affiliate;
}

export default function AmbassadorCodeCard({ affiliate }: AmbassadorCodeCardProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(affiliate.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const shareCode = async () => {
    const shareText = `Utilisez mon code parrainage EOLIA : ${affiliate.code} pour bénéficier d'avantages exclusifs sur votre éolienne Tulipe !`;
    const shareUrl = `${window.location.origin}/inscription?code=${affiliate.code}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Code parrainage EOLIA',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const remainingReferrals = (affiliate.referralLimit || 10) - (affiliate.referralCount || 0);

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Votre code parrainage</h3>
      
      <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-between">
        <span className="text-2xl font-mono font-bold text-emerald-700 tracking-wider">
          {affiliate.code}
        </span>
        <div className="flex gap-2">
          <button
            onClick={copyCode}
            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Copier le code"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
          </button>
          <button
            onClick={shareCode}
            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Partager"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p className="mb-2">
          Partagez ce code avec vos proches pour leur faire bénéficier d'avantages exclusifs.
        </p>
        <p className="font-medium text-emerald-700">
          {remainingReferrals > 0 
            ? `${remainingReferrals} parrainage${remainingReferrals > 1 ? 's' : ''} restant${remainingReferrals > 1 ? 's' : ''} cette année`
            : 'Limite de parrainages atteinte pour cette année'}
        </p>
      </div>
    </div>
  );
}
