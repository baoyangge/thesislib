import re

with open("src/app/[locale]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_hero = """      {/* Hero Section */}
      <div 
        className="bg-blue-900 py-20 px-4 sm:px-6 lg:px-8 text-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/coverimg.png')" }}
      >"""

new_hero = """      {/* Campaign Banner */}
      <div className="bg-orange-50 border-b border-orange-200 py-3 text-center">
        <Link href="/app/campaign" className="text-orange-700 font-bold hover:underline hover:text-orange-800 transition-colors text-sm sm:text-base px-4 block">
          {t("campaign_banner") || "New Campaign: Share your imperfect data and win up to 200 USD! Click here to learn more 👉"}
        </Link>
      </div>

      {/* Hero Section */}
      <div 
        className="bg-blue-900 py-20 px-4 sm:px-6 lg:px-8 text-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/coverimg.png')" }}
      >"""

content = content.replace(old_hero, new_hero)

with open("src/app/[locale]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Home patched.")
