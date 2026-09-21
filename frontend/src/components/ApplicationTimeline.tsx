"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface TimelineStep {
  status: string;
  label: string;
  labelHi: string;
  description: string;
  descriptionHi: string;
  completed: boolean;
  current: boolean;
  date?: Date;
}

interface ApplicationTimelineProps {
  currentStatus: string;
  statusHistory: Array<{
    status: string;
    remarks?: string;
    changedAt: Date;
  }>;
}

const WORKFLOW_STEPS = [
  {
    status: 'draft',
    label: 'Draft',
    labelHi: 'मसौदा',
    description: 'Application created but not submitted',
    descriptionHi: 'आवेदन बनाया गया लेकिन जमा नहीं किया गया'
  },
  {
    status: 'submitted',
    label: 'Submitted',
    labelHi: 'जमा किया गया',
    description: 'Application submitted for processing',
    descriptionHi: 'प्रसंस्करण के लिए आवेदन जमा किया गया'
  },
  {
    status: 'documents_under_review',
    label: 'Documents Under Review',
    labelHi: 'दस्तावेज़ समीक्षा में',
    description: 'Uploaded documents are being verified',
    descriptionHi: 'अपलोड किए गए दस्तावेज़ों की सत्यापन हो रहा है'
  },
  {
    status: 'correction_required',
    label: 'Correction Required',
    labelHi: 'सुधार आवश्यक',
    description: 'Please update your documents as per requirements',
    descriptionHi: 'आवश्यकताओं के अनुसार अपने दस्तावेज़ों को अपडेट करें'
  },
  {
    status: 'processing',
    label: 'Processing',
    labelHi: 'प्रसंस्करण में',
    description: 'Your application is being processed',
    descriptionHi: 'आपका आवेदन प्रसंस्करण में है'
  },
  {
    status: 'completed',
    label: 'Completed',
    labelHi: 'पूर्ण',
    description: 'Application processed successfully',
    descriptionHi: 'आवेदन सफलतापूर्वक प्रसंस्करित'
  },
  {
    status: 'rejected',
    label: 'Rejected',
    labelHi: 'अस्वीकृत',
    description: 'Application was rejected',
    descriptionHi: 'आवेदन अस्वीकृत कर दिया गया'
  },
  {
    status: 'cancelled',
    label: 'Cancelled',
    labelHi: 'रद्द',
    description: 'Application was cancelled',
    descriptionHi: 'आवेदन रद्द कर दिया गया'
  }
];

const STATUS_ORDER = [
  'draft',
  'submitted',
  'documents_under_review',
  'correction_required',
  'processing',
  'completed',
  'rejected',
  'cancelled'
];

export default function ApplicationTimeline({ currentStatus, statusHistory }: ApplicationTimelineProps) {
  const { lang } = useLanguage();

  const getStepStatus = (stepStatus: string, index: number) => {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    const stepIndex = STATUS_ORDER.indexOf(stepStatus);

    if (stepIndex < currentIndex) {
      return 'completed';
    } else if (stepIndex === currentIndex) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  const getIcon = (status: string) => {
    if (status === 'rejected' || status === 'cancelled') {
      return XCircle;
    } else if (status === 'correction_required') {
      return AlertCircle;
    } else {
      return CheckCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'current':
        return 'bg-saffron-500 text-white';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-500 text-white';
      case 'correction_required':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-navy-200 text-navy-600 dark:bg-navy-700 dark:text-navy-300';
    }
  };

  const relevantSteps = WORKFLOW_STEPS.filter(step => {
    if (currentStatus === 'rejected' || currentStatus === 'cancelled') {
      return STATUS_ORDER.indexOf(step.status) <= STATUS_ORDER.indexOf(currentStatus);
    }
    return true;
  });

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">
        {lang === 'hi' ? 'आवेदन समयरेखा' : 'Application Timeline'}
      </h3>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-navy-200 dark:bg-navy-700" />

        <div className="space-y-0">
          {relevantSteps.map((step, index) => {
            const stepStatus = getStepStatus(step.status, index);
            const Icon = getIcon(step.status);
            const statusHistoryEntry = statusHistory.find(h => h.status === step.status);

            return (
              <div key={step.status} className="relative pl-16 pb-8 last:pb-0">
                {/* Icon */}
                <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(stepStatus)}`}>
                  {stepStatus === 'pending' ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div className="card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-navy-900 dark:text-white">
                        {lang === 'hi' ? step.labelHi : step.label}
                      </h4>
                      {statusHistoryEntry && (
                        <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">
                          {new Date(statusHistoryEntry.changedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    {stepStatus === 'current' && (
                      <span className="px-2 py-1 bg-saffron-100 dark:bg-saffron-900/30 text-saffron-600 dark:text-saffron-400 text-xs font-medium rounded-full">
                        {lang === 'hi' ? 'वर्तमान' : 'Current'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-navy-600 dark:text-navy-300">
                    {lang === 'hi' ? step.descriptionHi : step.description}
                  </p>

                  {statusHistoryEntry?.remarks && (
                    <div className="mt-3 p-3 bg-navy-50 dark:bg-navy-800 rounded-lg">
                      <p className="text-sm text-navy-700 dark:text-navy-200">
                        <span className="font-medium">
                          {lang === 'hi' ? 'टिप्पणी:' : 'Remarks:'}
                        </span> {statusHistoryEntry.remarks}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}