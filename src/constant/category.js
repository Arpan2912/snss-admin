const categories = [
  {
    name: 'Valuation Scoop',
    value: 'valuation'
  },
  {
    name: 'Tax Tidings',
    value: 'tax'
  },
  {
    name: 'Fema Flash',
    value: 'fema'
  },
  {
    name: 'Global Business Setup',
    value: 'global_business_setup'
  },
  {
    name: 'Startup Sparkle',
    value: 'startup'
  }
];

const subCategories = {
  tax: [
    {
      name: 'Direct Tax',
      value: 'direct_tax'
    },
    {
      name: 'International Tax',
      value: 'international_tax'
    },
    {
      name: 'Transfer Pricing',
      value: 'transfer_pricing'
    },
    {
      name: 'GST',
      value: 'gst'
    },
    {
      name: 'NRI taxation',
      value: 'nri_taxation'
    }
  ],
  fema: [
    {
      name: 'Foreign Direct Investment',
      value: 'foreign_direct_investment'
    },
    {
      name: 'Overseas Investment',
      value: 'overseas_investment'
    },
    {
      name: 'External Commercial Borrowings',
      value: 'external_commercial_borrowings'
    },
    {
      name: 'Dealing In Immovable properties by NRI',
      value: 'dealing_in_immovable_properties_by_nri'
    }
  ],
  global_business_setup: [
    {
      name: 'United Arab Emirates(UAE)',
      value: 'uae'
    },
    {
      name: 'United States of America(USA)',
      value: 'usa'
    },
    {
      name: 'Canada',
      value: 'canada'
    }
  ]
}

export { categories, subCategories }