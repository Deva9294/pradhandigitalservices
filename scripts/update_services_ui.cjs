const fs = require('fs');
const path = require('path');

// 1. Update frontend/src/app/services/page.tsx
const servicesPagePath = path.join(__dirname, '..', 'frontend', 'src', 'app', 'services', 'page.tsx');
let file = fs.readFileSync(servicesPagePath, 'utf8');

// Ensure import
if (!file.includes('ServiceIcon')) {
  file = file.replace(
    'import { whatsAppUrl } from "@/lib/utils";',
    'import { whatsAppUrl } from "@/lib/utils";\nimport ServiceIcon from "@/components/common/ServiceIcon";'
  );
}

// Replace card title section with Service Logo + Title
const oldCardBlock = `                  {/* Service Titles */}
                  <Link href={\`/services/\${service.slug}\`} className="block group-hover:text-saffron-600 transition">
                    <h3 className="font-bold text-lg text-navy-900 dark:text-white leading-tight">
                      {service.name}
                    </h3>
                    {service.nameHi && (
                      <div className="text-sm font-semibold text-saffron-600 dark:text-saffron-400 mt-1">
                        {service.nameHi}
                      </div>
                    )}
                  </Link>`;

const newCardBlock = `                  {/* Service Logo & Titles */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700/80 shadow-sm flex items-center justify-center p-1.5 shrink-0 group-hover:scale-110 group-hover:border-saffron-400 group-hover:shadow-md transition">
                      <ServiceIcon
                        slug={service.slug}
                        department={service.department}
                        name={service.name}
                        alt={service.name}
                        size={36}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={\`/services/\${service.slug}\`} className="block group-hover:text-saffron-600 transition">
                        <h3 className="font-bold text-base sm:text-lg text-navy-900 dark:text-white leading-tight truncate">
                          {service.name}
                        </h3>
                        {service.nameHi && (
                          <div className="text-xs sm:text-sm font-semibold text-saffron-600 dark:text-saffron-400 mt-0.5 truncate">
                            {service.nameHi}
                          </div>
                        )}
                      </Link>
                    </div>
                  </div>`;

const normalize = s => s.replace(/\r\n/g, '\n');
let normFile = normalize(file);
let normOld = normalize(oldCardBlock);
let normNew = normalize(newCardBlock);

if (normFile.includes(normOld)) {
  normFile = normFile.replace(normOld, normNew);
  fs.writeFileSync(servicesPagePath, normFile, 'utf8');
  console.log('Successfully updated services/page.tsx with official logos!');
} else {
  console.log('Target block not matched in services/page.tsx, checking substrings...');
}

// 2. Update frontend/src/app/services/[slug]/page.tsx (Detail Page Hero)
const detailPagePath = path.join(__dirname, '..', 'frontend', 'src', 'app', 'services', '[slug]', 'page.tsx');
let detailFile = fs.readFileSync(detailPagePath, 'utf8');

if (!detailFile.includes('ServiceIcon')) {
  detailFile = detailFile.replace(
    'import { MASTER_SERVICES, ServiceCatalogueItem } from "@/data/servicesCatalogue";',
    'import { MASTER_SERVICES, ServiceCatalogueItem } from "@/data/servicesCatalogue";\nimport ServiceIcon from "@/components/common/ServiceIcon";'
  );
}

const oldHeroBlock = `          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">`;

const newHeroBlock = `          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-5 max-w-3xl">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white dark:bg-navy-800 border-2 border-navy-100 dark:border-navy-700/80 p-2.5 shadow-md shrink-0 flex items-center justify-center">
                <ServiceIcon
                  slug={service.slug}
                  department={service.department}
                  name={service.name}
                  alt={service.name}
                  size={72}
                />
              </div>
              <div className="space-y-2 flex-1">`;

const oldHeroClose = `              {service.descriptionHi && service.descriptionHi !== service.description && (
                <p className="text-navy-500 dark:text-navy-400 text-sm leading-relaxed">
                  {service.descriptionHi}
                </p>
              )}
            </div>`;

const newHeroClose = `              {service.descriptionHi && service.descriptionHi !== service.description && (
                <p className="text-navy-500 dark:text-navy-400 text-sm leading-relaxed">
                  {service.descriptionHi}
                </p>
              )}
              </div>
            </div>`;

let normDetail = normalize(detailFile);
let normOldHero = normalize(oldHeroBlock);
let normNewHero = normalize(newHeroBlock);
let normOldClose = normalize(oldHeroClose);
let normNewClose = normalize(newHeroClose);

if (normDetail.includes(normOldHero) && normDetail.includes(normOldClose)) {
  normDetail = normDetail.replace(normOldHero, normNewHero);
  normDetail = normDetail.replace(normOldClose, normNewClose);
  fs.writeFileSync(detailPagePath, normDetail, 'utf8');
  console.log('Successfully updated services/[slug]/page.tsx with official service logo hero!');
} else {
  console.log('Hero block target not matched in detail page');
}
