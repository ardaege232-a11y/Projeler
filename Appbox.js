from pathlib import Path
import re, json

src = Path("/mnt/data/AppBox_v5_Dosyani_Yayinla.html")
text = src.read_text(encoding="utf-8")

# Add i18n hooks to remaining visible static text.
repls = {
'''<div id="itchCategoryBar">
  <button onclick="setAppView('all')">🎮 Tüm Oyunlar</button>
  <button onclick="setAppView('popular')">🔥 Popüler</button>
  <button onclick="setAppView('new')">✨ Yeni</button>
  <button onclick="document.getElementById('publish').classList.toggle('hidden')">⬆️ Yayınla</button>
</div>''':
'''<div id="itchCategoryBar">
  <button onclick="setAppView('all')" data-i18n="catAll">🎮 Tüm Oyunlar</button>
  <button onclick="setAppView('popular')" data-i18n="catPopular">🔥 Popüler</button>
  <button onclick="setAppView('new')" data-i18n="catNew">✨ Yeni</button>
  <button onclick="document.getElementById('publish').classList.toggle('hidden')" data-i18n="catPublish">⬆️ Yayınla</button>
</div>''',
'<option value="" selected>Seçilmedi</option>':'<option value="" selected data-i18n="notSelected">Seçilmedi</option>',
'<option value="Game">Game</option>':'<option value="Game" data-i18n="typeGame">Oyun</option>',
'<option value="Application">Application</option>':'<option value="Application" data-i18n="typeApplication">Uygulama</option>',
'<option value="Browser Game">Browser Game</option>':'<option value="Browser Game" data-i18n="typeBrowserGame">Tarayıcı Oyunu</option>',
'<option value="">Seçilmedi</option>':'<option value="" data-i18n="notSelected">Seçilmedi</option>',
'<textarea id="appDescription" rows="4" placeholder="Açıklama..."></textarea>':'<textarea id="appDescription" rows="4" placeholder="Açıklama..." data-i18n-placeholder="descriptionPlaceholder"></textarea>',
'<input id="creatorPassword" type="password" autocomplete="new-password" placeholder="Harf ve sayı kullanın">':'<input id="creatorPassword" type="password" autocomplete="new-password" placeholder="Harf ve sayı kullanın" data-i18n-placeholder="passwordPlaceholder">',
'<h2>Yapımcının diğer projelerine göz at</h2>':'<h2 data-i18n="otherProjects">Yapımcının diğer projelerine göz at</h2>',
'<p>Developer, bu projedeki oyunları kendisi yapmıştır.</p>':'<p data-i18n="pixelhubDesc">Developer, bu projedeki oyunları kendisi yapmıştır.</p>',
'<p>Developer, bu projedeki oyun ve modları kendisi modlamış / hazırlamıştır.</p>':'<p data-i18n="pixelmodsDesc">Developer, bu projedeki oyun ve modları kendisi modlamış / hazırlamıştır.</p>',
'<option value="broken">Bozuk link</option>':'<option value="broken" data-i18n="reasonBroken">Bozuk link</option>',
'<option value="notworking">Çalışmıyor</option>':'<option value="notworking" data-i18n="reasonNotWorking">Çalışmıyor</option>',
'<option value="virus">Virüs şüphesi</option>':'<option value="virus" data-i18n="reasonVirus">Virüs şüphesi</option>',
'<button onclick="showHome()" style="position:absolute;top:12px;left:12px;z-index:2;border:0;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer">← Geri</button>':'<button onclick="showHome()" style="position:absolute;top:12px;left:12px;z-index:2;border:0;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer" data-i18n="back">← Geri</button>',
'<div class="back"><button class="btn dark" onclick="closeRegisterView()">← Geri</button></div>':'<div class="back"><button class="btn dark" onclick="closeRegisterView()" data-i18n="back">← Geri</button></div>',
'<input id="registerName" type="text" placeholder="Adını yaz">':'<input id="registerName" type="text" placeholder="Adını yaz" data-i18n-placeholder="namePlaceholder">',
'<div class="share-label">E-posta</div>':'<div class="share-label" data-i18n="emailLabel">E-posta</div>',
'<div class="developer">Developer: Çınar Gülser</div>':'<div class="developer" data-i18n="developerCredit">Developer: Çınar Gülser</div>',
'title="Sil" aria-label="Sil"':'title="Sil" aria-label="Sil" data-i18n-title="deleteApp" data-i18n-aria="deleteApp"',
}
for a,b in repls.items():
    text = text.replace(a,b)

# Translation additions/overrides.
extra = {
"tr": {
"heroTitle":"Bağımsız oyunları ve uygulamaları keşfet 🎮",
"catAll":"🎮 Tüm Oyunlar","catPopular":"🔥 Popüler","catNew":"✨ Yeni","catPublish":"⬆️ Yayınla",
"notSelected":"Seçilmedi","typeGame":"Oyun","typeApplication":"Uygulama","typeBrowserGame":"Tarayıcı Oyunu",
"descriptionPlaceholder":"Açıklama...","passwordPlaceholder":"Harf ve sayı kullanın","namePlaceholder":"Adını yaz",
"pixelhubDesc":"Developer, bu projedeki oyunları kendisi yapmıştır.",
"pixelmodsDesc":"Developer, bu projedeki oyun ve modları kendisi modlamış / hazırlamıştır.",
"reasonBroken":"Bozuk link","reasonNotWorking":"Çalışmıyor","reasonVirus":"Virüs şüphesi",
"emailLabel":"E-posta","developerCredit":"Developer: Çınar Gülser",
"invalidAccount":"Ad ve geçerli bir e-posta gir.",
"shareMessage":"AppBox'ta bu oyun/uygulamaya göz at:","copyPrompt":"Bağlantıyı kopyala:"
},
"en": {
"heroTitle":"Discover indie games and apps 🎮",
"catAll":"🎮 All Games","catPopular":"🔥 Popular","catNew":"✨ New","catPublish":"⬆️ Publish",
"notSelected":"Not selected","typeGame":"Game","typeApplication":"Application","typeBrowserGame":"Browser Game",
"descriptionPlaceholder":"Description...","passwordPlaceholder":"Use letters and numbers","namePlaceholder":"Enter your name",
"pixelhubDesc":"The developer created the games in this project.",
"pixelmodsDesc":"The developer personally modded / prepared the games and mods in this project.",
"reasonBroken":"Broken link","reasonNotWorking":"Not working","reasonVirus":"Virus suspicion",
"emailLabel":"Email","developerCredit":"Developer: Çınar Gülser",
"invalidAccount":"Enter a name and a valid email address.",
"shareMessage":"Check out this game/app on AppBox:","copyPrompt":"Copy the link:"
},
"ru": {
"heroTitle":"Откройте инди-игры и приложения 🎮",
"catAll":"🎮 Все игры","catPopular":"🔥 Популярное","catNew":"✨ Новое","catPublish":"⬆️ Опубликовать",
"notSelected":"Не выбрано","typeGame":"Игра","typeApplication":"Приложение","typeBrowserGame":"Браузерная игра",
"descriptionPlaceholder":"Описание...","passwordPlaceholder":"Используйте буквы и цифры","namePlaceholder":"Введите имя",
"pixelhubDesc":"Разработчик сам создал игры в этом проекте.",
"pixelmodsDesc":"Разработчик сам модифицировал / подготовил игры и моды в этом проекте.",
"reasonBroken":"Нерабочая ссылка","reasonNotWorking":"Не работает","reasonVirus":"Подозрение на вирус",
"emailLabel":"Эл. почта","developerCredit":"Разработчик: Çınar Gülser",
"invalidAccount":"Введите имя и действительный адрес электронной почты.",
"shareMessage":"Посмотрите эту игру/приложение в AppBox:","copyPrompt":"Скопируйте ссылку:"
}
}
assign = "\n".join(
    f'Object.assign(translations.{lang},{json.dumps(vals, ensure_ascii=False)});'
    for lang, vals in extra.items()
)

# Inject before t() once.
needle = 'function t(k){return translations[lang][k]||k}'
if assign not in text:
    text = text.replace(needle, assign + "\n\n" + needle, 1)

# Replace remaining hardcoded strings in JS.
text = text.replace('alert("Ad ve geçerli bir e-posta gir.");', 'alert(t("invalidAccount"));')
text = text.replace('`AppBox\\\'ta bu oyun/uygulamaya göz at:\\n${app.name}\\n${url}`', '`${t("shareMessage")}\\n${app.name}\\n${url}`')
text = text.replace('prompt("Bağlantıyı kopyala:",url);', 'prompt(t("copyPrompt"),url);')

# Extend language change to placeholders/title/aria.
old = ''' document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
 document.getElementById("searchInput").placeholder=lang==="en"?"Search apps or games...":lang==="ru"?"Поиск приложений или игр...":"Uygulama veya oyun ara...";
 document.getElementById("commentText").placeholder=t("commentPlaceholder");'''
new = ''' document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
 document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>el.placeholder=t(el.dataset.i18nPlaceholder));
 document.querySelectorAll("[data-i18n-title]").forEach(el=>el.title=t(el.dataset.i18nTitle));
 document.querySelectorAll("[data-i18n-aria]").forEach(el=>el.setAttribute("aria-label",t(el.dataset.i18nAria)));
 document.getElementById("searchInput").placeholder=lang==="en"?"Search apps or games...":lang==="ru"?"Поиск приложений или игр...":"Uygulama veya oyun ara...";
 document.getElementById("commentText").placeholder=t("commentPlaceholder");'''
if old in text:
    text = text.replace(old, new, 1)

# Add helper for translating stored content-type labels and use it where straightforward.
helper = '''function typeLabel(v){
 if(v==="Game")return t("typeGame");
 if(v==="Application")return t("typeApplication");
 if(v==="Browser Game")return t("typeBrowserGame");
 return v||"";
}
'''
if "function typeLabel(v)" not in text:
    text = text.replace('function saveApps(){', helper + '\nfunction saveApps(){', 1)

# Common UI render occurrences.
text = text.replace('${escapeHtml(app.type)}', '${escapeHtml(typeLabel(app.type))}')
text = text.replace('${app.type}', '${typeLabel(app.type)}')

# Apply current language once at startup if the page only set selector without refreshing all hooked strings.
# Existing startup may call changeLanguage already; this remains harmless.
startup_marker = 'document.getElementById("languageSelect").value=lang;'
if startup_marker in text and 'changeLanguage(lang);' not in text[text.find(startup_marker):text.find(startup_marker)+200]:
    text = text.replace(startup_marker, startup_marker + '\nchangeLanguage(lang);', 1)

out = Path("/mnt/data/AppBox_v5_Tam_Dil_Cevirisi.html")
out.write_text(text, encoding="utf-8")

# Basic JS syntax check using node if available.
scripts = re.findall(r'<script>(.*?)</script>', text, re.S)
js = "\n".join(scripts)
check = Path("/mnt/data/appbox_lang_check.js")
check.write_text(js, encoding="utf-8")
print(out)
print("JS bytes:", len(js))
