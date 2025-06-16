"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Plus,
  MessageSquare,
  Users,
  Video,
  Phone,
  MoreVertical,
  Smile,
  Paperclip,
  Send,
  X,
  Download,
  Play,
  FileText,
  ImageIcon,
  Film,
  ArrowLeft,
} from "lucide-react"
import { useUser } from "../context/UserContext"
import "./Chats.css"

const Chats = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [activeChat, setActiveChat] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [message, setMessage] = useState("")
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({})
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState([])
  const [emojiSearchQuery, setEmojiSearchQuery] = useState("")
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState("smileys")
  const [recentEmojis, setRecentEmojis] = useState(["😊", "👍", "❤️", "😂", "🎉"])
  const [showMobileChat, setShowMobileChat] = useState(false)

  const fileInputRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const chatInputRef = useRef(null)

  // Emoji data organized by categories
  const emojiCategories = {
    smileys: {
      name: "Smileys & People",
      emojis: [
        "😀",
        "😃",
        "😄",
        "😁",
        "😆",
        "😅",
        "🤣",
        "😂",
        "🙂",
        "🙃",
        "😉",
        "😊",
        "😇",
        "🥰",
        "😍",
        "🤩",
        "😘",
        "😗",
        "😚",
        "😙",
        "😋",
        "😛",
        "😜",
        "🤪",
        "😝",
        "🤑",
        "🤗",
        "🤭",
        "🤫",
        "🤔",
        "🤐",
        "🤨",
        "😐",
        "😑",
        "😶",
        "😏",
        "😒",
        "🙄",
        "😬",
        "🤥",
        "😔",
        "😪",
        "🤤",
        "😴",
        "😷",
        "🤒",
        "🤕",
        "🤢",
        "🤮",
        "🤧",
        "🥵",
        "🥶",
        "🥴",
        "😵",
        "🤯",
        "🤠",
        "🥳",
        "😎",
        "🤓",
        "🧐",
      ],
    },
    animals: {
      name: "Animals & Nature",
      emojis: [
        "🐶",
        "🐱",
        "🐭",
        "🐹",
        "🐰",
        "🦊",
        "🐻",
        "🐼",
        "🐨",
        "🐯",
        "🦁",
        "🐮",
        "🐷",
        "🐽",
        "🐸",
        "🐵",
        "🙈",
        "🙉",
        "🙊",
        "🐒",
        "🐔",
        "🐧",
        "🐦",
        "🐤",
        "🐣",
        "🐥",
        "🦆",
        "🦅",
        "🦉",
        "🦇",
        "🐺",
        "🐗",
        "🐴",
        "🦄",
        "🐝",
        "🐛",
        "🦋",
        "🐌",
        "🐞",
        "🐜",
        "🦟",
        "🦗",
        "🕷",
        "🕸",
        "🦂",
        "🐢",
        "🐍",
        "🦎",
        "🦖",
        "🦕",
        "🐙",
        "🦑",
        "🦐",
        "🦞",
        "🦀",
        "🐡",
        "🐠",
        "🐟",
        "🐬",
        "🐳",
        "🐋",
        "🦈",
        "🐊",
        "🐅",
        "🐆",
        "🦓",
        "🦍",
        "🦧",
        "🐘",
        "🦛",
        "🦏",
        "🐪",
        "🐫",
        "🦒",
        "🦘",
        "🐃",
        "🐂",
        "🐄",
        "🐎",
        "🐖",
        "🐏",
        "🐑",
        "🦙",
        "🐐",
        "🦌",
        "🐕",
        "🐩",
        "🦮",
        "🐕‍🦺",
        "🐈",
        "🐓",
        "🦃",
        "🦚",
        "🦜",
        "🦢",
        "🦩",
        "🕊",
        "🐇",
        "🦝",
        "🦨",
        "🦡",
        "🦦",
        "🦥",
        "🐁",
        "🐀",
        "🐿",
        "🦔",
      ],
    },
    food: {
      name: "Food & Drink",
      emojis: [
        "🍎",
        "🍐",
        "🍊",
        "🍋",
        "🍌",
        "🍉",
        "🍇",
        "🍓",
        "🫐",
        "🍈",
        "🍒",
        "🍑",
        "🥭",
        "🍍",
        "🥥",
        "🥝",
        "🍅",
        "🍆",
        "🥑",
        "🥦",
        "🥬",
        "🥒",
        "🌶",
        "🫑",
        "🌽",
        "🥕",
        "🫒",
        "🧄",
        "🧅",
        "🥔",
        "🍠",
        "🥐",
        "🥯",
        "🍞",
        "🥖",
        "🥨",
        "🧀",
        "🥚",
        "🍳",
        "🧈",
        "🥞",
        "🧇",
        "🥓",
        "🥩",
        "🍗",
        "🍖",
        "🦴",
        "🌭",
        "🍔",
        "🍟",
        "🍕",
        "🫓",
        "🥪",
        "🥙",
        "🧆",
        "🌮",
        "🌯",
        "🫔",
        "🥗",
        "🥘",
        "🫕",
        "🥫",
        "🍝",
        "🍜",
        "🍲",
        "🍛",
        "🍣",
        "🍱",
        "🥟",
        "🦪",
        "🍤",
        "🍙",
        "🍚",
        "🍘",
        "🍥",
        "🥠",
        "🥮",
        "🍢",
        "🍡",
        "🍧",
        "🍨",
        "🍦",
        "🥧",
        "🧁",
        "🍰",
        "🎂",
        "🍮",
        "🍭",
        "🍬",
        "🍫",
        "🍿",
        "🍩",
        "🍪",
        "🌰",
        "🥜",
        "🍯",
      ],
    },
    activities: {
      name: "Activities",
      emojis: [
        "⚽",
        "🏀",
        "🏈",
        "⚾",
        "🥎",
        "🎾",
        "🏐",
        "🏉",
        "🥏",
        "🎱",
        "🪀",
        "🏓",
        "🏸",
        "🏒",
        "🏑",
        "🥍",
        "🏏",
        "🪃",
        "🥅",
        "⛳",
        "🪁",
        "🏹",
        "🎣",
        "🤿",
        "🥊",
        "🥋",
        "🎽",
        "🛹",
        "🛷",
        "⛸",
        "🥌",
        "🎿",
        "⛷",
        "🏂",
        "🪂",
        "🏋️‍♀️",
        "🏋️",
        "🏋️‍♂️",
        "🤼‍♀️",
        "🤼",
        "🤼‍♂️",
        "🤸‍♀️",
        "🤸",
        "🤸‍♂️",
        "⛹️‍♀️",
        "⛹️",
        "⛹️‍♂️",
        "🤺",
        "🤾‍♀️",
        "🤾",
        "🤾‍♂️",
        "🏌️‍♀️",
        "🏌️",
        "🏌️‍♂️",
        "🏇",
        "🧘‍♀️",
        "🧘",
        "🧘‍♂️",
        "🏄‍♀️",
        "🏄",
        "🏄‍♂️",
        "🏊‍♀️",
        "🏊",
        "🏊‍♂️",
        "🤽‍♀️",
        "🤽",
        "🤽‍♂️",
        "🚣‍♀️",
        "🚣",
        "🚣‍♂️",
        "🧗‍♀️",
        "🧗",
        "🧗‍♂️",
        "🚵‍♀️",
        "🚵",
        "🚵‍♂️",
        "🚴‍♀️",
        "🚴",
        "🚴‍♂️",
        "🏆",
        "🥇",
        "🥈",
        "🥉",
        "🏅",
        "🎖",
        "🏵",
        "🎗",
        "🎫",
        "🎟",
        "🎪",
        "🤹‍♀️",
        "🤹",
        "🤹‍♂️",
        "🎭",
        "🩰",
        "🎨",
        "🎬",
        "🎤",
        "🎧",
        "🎼",
        "🎵",
        "🎶",
        "🥁",
        "🪘",
        "🎹",
        "🎷",
        "🎺",
        "🎸",
        "🪕",
        "🎻",
        "🎲",
        "♟",
        "🎯",
        "🎳",
        "🎮",
        "🎰",
        "🧩",
      ],
    },
    travel: {
      name: "Travel & Places",
      emojis: [
        "🚗",
        "🚕",
        "🚙",
        "🚌",
        "🚎",
        "🏎",
        "🚓",
        "🚑",
        "🚒",
        "🚐",
        "🛻",
        "🚚",
        "🚛",
        "🚜",
        "🏍",
        "🛵",
        "🚲",
        "🛴",
        "🛹",
        "🛼",
        "🚁",
        "🛸",
        "✈️",
        "🛩",
        "🛫",
        "🛬",
        "🪂",
        "💺",
        "🚀",
        "🛰",
        "🚉",
        "🚊",
        "🚝",
        "🚞",
        "🚋",
        "🚃",
        "🚋",
        "🚞",
        "🚝",
        "🚄",
        "🚅",
        "🚈",
        "🚂",
        "🚆",
        "🚇",
        "🚊",
        "🚉",
        "✈️",
        "🛫",
        "🛬",
        "🛩",
        "💺",
        "🚁",
        "🚟",
        "🚠",
        "🚡",
        "🛰",
        "🚀",
        "🛸",
        "🛎",
        "🧳",
        "⌛",
        "⏳",
        "⌚",
        "⏰",
        "⏱",
        "⏲",
        "🕰",
        "🕛",
        "🕧",
        "🕐",
        "🕜",
        "🕑",
        "🕝",
        "🕒",
        "🕞",
        "🕓",
        "🕟",
        "🕔",
        "🕠",
        "🕕",
        "🕡",
        "🕖",
        "🕢",
        "🕗",
        "🕣",
        "🕘",
        "🕤",
        "🕙",
        "🕥",
        "🕚",
        "🕦",
      ],
    },
    objects: {
      name: "Objects",
      emojis: [
        "⌚",
        "📱",
        "📲",
        "💻",
        "⌨️",
        "🖥",
        "🖨",
        "🖱",
        "🖲",
        "🕹",
        "🗜",
        "💽",
        "💾",
        "💿",
        "📀",
        "📼",
        "📷",
        "📸",
        "📹",
        "🎥",
        "📽",
        "🎞",
        "📞",
        "☎️",
        "📟",
        "📠",
        "📺",
        "📻",
        "🎙",
        "🎚",
        "🎛",
        "🧭",
        "⏱",
        "⏲",
        "⏰",
        "🕰",
        "⌛",
        "⏳",
        "📡",
        "🔋",
        "🔌",
        "💡",
        "🔦",
        "🕯",
        "🪔",
        "🧯",
        "🛢",
        "💸",
        "💵",
        "💴",
        "💶",
        "💷",
        "🪙",
        "💰",
        "💳",
        "💎",
        "⚖️",
        "🪜",
        "🧰",
        "🔧",
        "🔨",
        "⚒",
        "🛠",
        "⛏",
        "🪓",
        "🪚",
        "🔩",
        "⚙️",
        "🪤",
        "🧱",
        "⛓",
        "🧲",
        "🔫",
        "💣",
        "🧨",
        "🪓",
        "🔪",
        "🗡",
        "⚔️",
        "🛡",
        "🚬",
        "⚰️",
        "🪦",
        "⚱️",
        "🏺",
        "🔮",
        "📿",
        "🧿",
        "💈",
        "⚗️",
        "🔭",
        "🔬",
        "🕳",
        "🩹",
        "🩺",
        "💊",
        "💉",
        "🩸",
        "🧬",
        "🦠",
        "🧫",
        "🧪",
        "🌡",
        "🧹",
        "🪣",
        "🧽",
        "🧴",
        "🛎",
        "🔑",
        "🗝",
        "🚪",
        "🪑",
        "🛋",
        "🛏",
        "🛌",
        "🧸",
        "🪆",
        "🖼",
        "🪞",
        "🪟",
        "🛍",
        "🛒",
        "🎁",
        "🎈",
        "🎏",
        "🎀",
        "🪄",
        "🪅",
        "🎊",
        "🎉",
        "🎎",
        "🏮",
        "🎐",
        "🧧",
        "✉️",
        "📩",
        "📨",
        "📧",
        "💌",
        "📥",
        "📤",
        "📦",
        "🏷",
        "🪧",
        "📪",
        "📫",
        "📬",
        "📭",
        "📮",
        "📯",
        "📜",
        "📃",
        "📄",
        "📑",
        "🧾",
        "📊",
        "📈",
        "📉",
        "🗒",
        "🗓",
        "📆",
        "📅",
        "🗑",
        "📇",
        "🗃",
        "🗳",
        "🗄",
        "📋",
        "📁",
        "📂",
        "🗂",
        "🗞",
        "📰",
        "📓",
        "📔",
        "📒",
        "📕",
        "📗",
        "📘",
        "📙",
        "📚",
        "📖",
        "🔖",
        "🧷",
        "🔗",
        "📎",
        "🖇",
        "📐",
        "📏",
        "🧮",
        "📌",
        "📍",
        "✂️",
        "🖊",
        "🖋",
        "✒️",
        "🖌",
        "🖍",
        "📝",
        "✏️",
        "🔍",
        "🔎",
        "🔏",
        "🔐",
        "🔒",
        "🔓",
      ],
    },
    symbols: {
      name: "Symbols",
      emojis: [
        "❤️",
        "🧡",
        "💛",
        "💚",
        "💙",
        "💜",
        "🖤",
        "🤍",
        "🤎",
        "💔",
        "❣️",
        "💕",
        "💞",
        "💓",
        "💗",
        "💖",
        "💘",
        "💝",
        "💟",
        "☮️",
        "✝️",
        "☪️",
        "🕉",
        "☸️",
        "✡️",
        "🔯",
        "🕎",
        "☯️",
        "☦️",
        "🛐",
        "⛎",
        "♈",
        "♉",
        "♊",
        "♋",
        "♌",
        "♍",
        "♎",
        "♏",
        "♐",
        "♑",
        "♒",
        "♓",
        "🆔",
        "⚛️",
        "🉑",
        "☢️",
        "☣️",
        "📴",
        "📳",
        "🈶",
        "🈚",
        "🈸",
        "🈺",
        "🈷️",
        "✴️",
        "🆚",
        "💮",
        "🉐",
        "㊙️",
        "㊗️",
        "🈴",
        "🈵",
        "🈹",
        "🈲",
        "🅰️",
        "🅱️",
        "🆎",
        "🆑",
        "🅾️",
        "🆘",
        "❌",
        "⭕",
        "🛑",
        "⛔",
        "📛",
        "🚫",
        "💯",
        "💢",
        "♨️",
        "🚷",
        "🚯",
        "🚳",
        "🚱",
        "🔞",
        "📵",
        "🚭",
        "❗",
        "❕",
        "❓",
        "❔",
        "‼️",
        "⁉️",
        "🔅",
        "🔆",
        "〽️",
        "⚠️",
        "🚸",
        "🔱",
        "⚜️",
        "🔰",
        "♻️",
        "✅",
        "🈯",
        "💹",
        "❇️",
        "✳️",
        "❎",
        "🌐",
        "💠",
        "Ⓜ️",
        "🌀",
        "💤",
        "🏧",
        "🚾",
        "♿",
        "🅿️",
        "🛗",
        "🈳",
        "🈂️",
        "🛂",
        "🛃",
        "🛄",
        "🛅",
        "🚹",
        "🚺",
        "🚼",
        "⚧",
        "🚻",
        "🚮",
        "🎦",
        "📶",
        "🈁",
        "🔣",
        "ℹ️",
        "🔤",
        "🔡",
        "🔠",
        "🆖",
        "🆗",
        "🆙",
        "🆒",
        "🆕",
        "🆓",
        "0️⃣",
        "1️⃣",
        "2️⃣",
        "3️⃣",
        "4️⃣",
        "5️⃣",
        "6️⃣",
        "7️⃣",
        "8️⃣",
        "9️⃣",
        "🔟",
        "🔢",
        "#️⃣",
        "*️⃣",
        "⏏️",
        "▶️",
        "⏸",
        "⏯",
        "⏹",
        "⏺",
        "⏭",
        "⏮",
        "⏩",
        "⏪",
        "⏫",
        "⏬",
        "◀️",
        "🔼",
        "🔽",
        "➡️",
        "⬅️",
        "⬆️",
        "⬇️",
        "↗️",
        "↘️",
        "↙️",
        "↖️",
        "↕️",
        "↔️",
        "↪️",
        "↩️",
        "⤴️",
        "⤵️",
        "🔀",
        "🔁",
        "🔂",
        "🔄",
        "🔃",
        "🎵",
        "🎶",
        "➕",
        "➖",
        "➗",
        "✖️",
        "🟰",
        "♾",
        "💲",
        "💱",
        "™️",
        "©️",
        "®️",
        "〰️",
        "➰",
        "➿",
        "🔚",
        "🔙",
        "🔛",
        "🔝",
        "🔜",
        "✔️",
        "☑️",
        "🔘",
        "🔴",
        "🟠",
        "🟡",
        "🟢",
        "🔵",
        "🟣",
        "⚫",
        "⚪",
        "🟤",
        "🔺",
        "🔻",
        "🔸",
        "🔹",
        "🔶",
        "🔷",
        "🔳",
        "🔲",
        "▪️",
        "▫️",
        "◾",
        "◽",
        "◼️",
        "◻️",
        "🟥",
        "🟧",
        "🟨",
        "🟩",
        "🟦",
        "🟪",
        "⬛",
        "⬜",
        "🟫",
        "🔈",
        "🔇",
        "🔉",
        "🔊",
        "🔔",
        "🔕",
        "📣",
        "📢",
        "👁‍🗨",
        "💬",
        "💭",
        "🗯",
        "♠️",
        "♣️",
        "♥️",
        "♦️",
        "🃏",
        "🎴",
        "🀄",
        "🕐",
        "🕑",
        "🕒",
        "🕓",
        "🕔",
        "🕕",
        "🕖",
        "🕗",
        "🕘",
        "🕙",
        "🕚",
        "🕛",
        "🕜",
        "🕝",
        "🕞",
        "🕟",
        "🕠",
        "🕡",
        "🕢",
        "🕣",
        "🕤",
        "🕥",
        "🕦",
        "🕧",
      ],
    },
    flags: {
      name: "Flags",
      emojis: [
        "🏁",
        "🚩",
        "🎌",
        "🏴",
        "🏳️",
        "🏳️‍🌈",
        "🏳️‍⚧️",
        "🏴‍☠️",
        "🇦🇨",
        "🇦🇩",
        "🇦🇪",
        "🇦🇫",
        "🇦🇬",
        "🇦🇮",
        "🇦🇱",
        "🇦🇲",
        "🇦🇴",
        "🇦🇶",
        "🇦🇷",
        "🇦🇸",
        "🇦🇹",
        "🇦🇺",
        "🇦🇼",
        "🇦🇽",
        "🇦🇿",
        "🇧🇦",
        "🇧🇧",
        "🇧🇩",
        "🇧🇪",
        "🇧🇫",
        "🇧🇬",
        "🇧🇭",
        "🇧🇮",
        "🇧🇯",
        "🇧🇱",
        "🇧🇲",
        "🇧🇳",
        "🇧🇴",
        "🇧🇶",
        "🇧🇷",
        "🇧🇸",
        "🇧🇹",
        "🇧🇻",
        "🇧🇼",
        "🇧🇾",
        "🇧🇿",
        "🇨🇦",
        "🇨🇨",
        "🇨🇩",
        "🇨🇫",
        "🇨🇬",
        "🇨🇭",
        "🇨🇮",
        "🇨🇰",
        "🇨🇱",
        "🇨🇲",
        "🇨🇳",
        "🇨🇴",
        "🇨🇵",
        "🇨🇷",
        "🇨🇺",
        "🇨🇻",
        "🇨🇼",
        "🇨🇽",
        "🇨🇾",
        "🇨🇿",
        "🇩🇪",
        "🇩🇬",
        "🇩🇯",
        "🇩🇰",
        "🇩🇲",
        "🇩🇴",
        "🇩🇿",
        "🇪🇦",
        "🇪🇨",
        "🇪🇪",
        "🇪🇬",
        "🇪🇭",
        "🇪🇷",
        "🇪🇸",
        "🇪🇹",
        "🇪🇺",
        "🇫🇮",
        "🇫🇯",
        "🇫🇰",
        "🇫🇲",
        "🇫🇴",
        "🇫🇷",
        "🇬🇦",
        "🇬🇧",
        "🇬🇩",
        "🇬🇪",
        "🇬🇫",
        "🇬🇬",
        "🇬🇭",
        "🇬🇮",
        "🇬🇱",
        "🇬🇲",
        "🇬🇳",
        "🇬🇵",
        "🇬🇶",
        "🇬🇷",
        "🇬🇸",
        "🇬🇹",
        "🇬🇺",
        "🇬🇼",
        "🇬🇾",
        "🇭🇰",
        "🇭🇲",
        "🇭🇳",
        "🇭🇷",
        "🇭🇹",
        "🇭🇺",
        "🇮🇨",
        "🇮🇩",
        "🇮🇪",
        "🇮🇱",
        "🇮🇲",
        "🇮🇳",
        "🇮🇴",
        "🇮🇶",
        "🇮🇷",
        "🇮🇸",
        "🇮🇹",
        "🇯🇪",
        "🇯🇲",
        "🇯🇴",
        "🇯🇵",
        "🇰🇪",
        "🇰🇬",
        "🇰🇭",
        "🇰🇮",
        "🇰🇲",
        "🇰🇳",
        "🇰🇵",
        "🇰🇷",
        "🇰🇼",
        "🇰🇾",
        "🇰🇿",
        "🇱🇦",
        "🇱🇧",
        "🇱🇨",
        "🇱🇮",
        "🇱🇰",
        "🇱🇷",
        "🇱🇸",
        "🇱🇹",
        "🇱🇺",
        "🇱🇻",
        "🇱🇾",
        "🇲🇦",
        "🇲🇨",
        "🇲🇩",
        "🇲🇪",
        "🇲🇫",
        "🇲🇬",
        "🇲🇭",
        "🇲🇰",
        "🇲🇱",
        "🇲🇲",
        "🇲🇳",
        "🇲🇴",
        "🇲🇵",
        "🇲🇶",
        "🇲🇷",
        "🇲🇸",
        "🇲🇹",
        "🇲🇺",
        "🇲🇻",
        "🇲🇼",
        "🇲🇽",
        "🇲🇾",
        "🇲🇿",
        "🇳🇦",
        "🇳🇨",
        "🇳🇪",
        "🇳🇫",
        "🇳🇬",
        "🇳🇮",
        "🇳🇱",
        "🇳🇴",
        "🇳🇵",
        "🇳🇷",
        "🇳🇺",
        "🇳🇿",
        "🇴🇲",
        "🇵🇦",
        "🇵🇪",
        "🇵🇫",
        "🇵🇬",
        "🇵🇭",
        "🇵🇰",
        "🇵🇱",
        "🇵🇲",
        "🇵🇳",
        "🇵🇷",
        "🇵🇸",
        "🇵🇹",
        "🇵🇼",
        "🇵🇾",
        "🇶🇦",
        "🇷🇪",
        "🇷🇴",
        "🇷🇸",
        "🇷🇺",
        "🇷🇼",
        "🇸🇦",
        "🇸🇧",
        "🇸🇨",
        "🇸🇩",
        "🇸🇪",
        "🇸🇬",
        "🇸🇭",
        "🇸🇮",
        "🇸🇯",
        "🇸🇰",
        "🇸🇱",
        "🇸🇲",
        "🇸🇳",
        "🇸🇴",
        "🇸🇷",
        "🇸🇸",
        "🇸🇹",
        "🇸🇻",
        "🇸🇽",
        "🇸🇾",
        "🇸🇿",
        "🇹🇦",
        "🇹🇨",
        "🇹🇩",
        "🇹🇫",
        "🇹🇬",
        "🇹🇭",
        "🇹🇯",
        "🇹🇰",
        "🇹🇱",
        "🇹🇲",
        "🇹🇳",
        "🇹🇴",
        "🇹🇷",
        "🇹🇹",
        "🇹🇻",
        "🇹🇼",
        "🇹🇿",
        "🇺🇦",
        "🇺🇬",
        "🇺🇲",
        "🇺🇳",
        "🇺🇸",
        "🇺🇾",
        "🇺🇿",
        "🇻🇦",
        "🇻🇨",
        "🇻🇪",
        "🇻🇬",
        "🇻🇮",
        "🇻🇳",
        "🇻🇺",
        "🇼🇫",
        "🇼🇸",
        "🇽🇰",
        "🇾🇪",
        "🇾🇹",
        "🇿🇦",
        "🇿🇲",
        "🇿🇼",
        "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
      ],
    },
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const fetchConversations = async () => {
    // Simulate API call
    const mockConversations = [
      {
        id: 1,
        type: "direct",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "Thanks for the study notes!",
        lastMessageTime: "2024-01-11T15:30:00Z",
        unreadCount: 2,
        isOnline: true,
      },
      {
        id: 2,
        type: "group",
        name: "SOA Exam P Study Group",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "Mike: Let's schedule our next session",
        lastMessageTime: "2024-01-11T14:45:00Z",
        unreadCount: 5,
        memberCount: 24,
      },
      {
        id: 3,
        type: "direct",
        name: "Mike Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "Did you finish the probability homework?",
        lastMessageTime: "2024-01-11T12:20:00Z",
        unreadCount: 0,
        isOnline: false,
      },
      {
        id: 4,
        type: "group",
        name: "Actuarial Python Coding",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "Emily: Check out this new library",
        lastMessageTime: "2024-01-11T10:15:00Z",
        unreadCount: 1,
        memberCount: 18,
      },
      {
        id: 5,
        type: "direct",
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "Great explanation in today's session!",
        lastMessageTime: "2024-01-10T18:30:00Z",
        unreadCount: 0,
        isOnline: true,
      },
    ]

    setConversations(mockConversations)

    // Mock messages for each conversation with different types
    const mockMessages = {
      1: [
        {
          id: 1,
          senderId: "user123",
          senderName: "Sarah Johnson",
          message: "Hey! How's the exam prep going?",
          timestamp: "2024-01-11T15:00:00Z",
          avatar: "/placeholder.svg?height=32&width=32",
          type: "text",
        },
        {
          id: 2,
          senderId: user.id,
          senderName: user.name,
          message: "Pretty good! Just finished the probability chapter.",
          timestamp: "2024-01-11T15:15:00Z",
          avatar: "/placeholder.svg?height=32&width=32",
          type: "text",
        },
        {
          id: 3,
          senderId: "user123",
          senderName: "Sarah Johnson",
          message: "Thanks for the study notes!",
          timestamp: "2024-01-11T15:30:00Z",
          avatar: "/placeholder.svg?height=32&width=32",
          type: "text",
        },
        {
          id: 4,
          senderId: user.id,
          senderName: user.name,
          message: "",
          timestamp: "2024-01-11T15:35:00Z",
          avatar: "/placeholder.svg?height=32&width=32",
          type: "image",
          fileData: {
            name: "probability_formulas.png",
            size: "2.3 MB",
            url: "/placeholder.svg?height=200&width=300",
          },
        },
      ],
      2: [
        {
          id: 1,
          senderId: "user456",
          senderName: "Mike Chen",
          message: "Let's schedule our next session",
          timestamp: "2024-01-11T14:45:00Z",
          avatar: "/placeholder.svg?height=32&width=32",
          type: "text",
        },
        {
          id: 2,
          senderId: "user789",
          senderName: "Alex Smith",
          message: "",
          timestamp: "2024-01-11T14:50:00Z",
          avatar: "/placeholder.svg?height=32&width=32",
          type: "file",
          fileData: {
            name: "SOA_Exam_P_Notes.pdf",
            size: "15.7 MB",
            url: "#",
            type: "pdf",
          },
        },
      ],
    }

    setMessages(mockMessages)
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleConversationClick = (conversation) => {
    setActiveChat(conversation)
    setShowMobileChat(true)
  }

  const handleBackToList = () => {
    setShowMobileChat(false)
    setActiveChat(null)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim() || !activeChat) return

    const newMessage = {
      id: Date.now(),
      senderId: user.id,
      senderName: user.name,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      avatar: "/placeholder.svg?height=32&width=32",
      type: "text",
    }

    setMessages((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage],
    }))

    setMessage("")
    setShowEmojiPicker(false) // Close emoji picker after sending

    // Update last message in conversation
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeChat.id
          ? {
              ...conv,
              lastMessage: message.trim(),
              lastMessageTime: new Date().toISOString(),
            }
          : conv,
      ),
    )
  }

  const handleVideoCall = () => {
    if (activeChat) {
      navigate(`/video-call?participant=${encodeURIComponent(activeChat.name)}&id=${activeChat.id}`)
    }
  }

  const handleAudioCall = () => {
    if (activeChat) {
      navigate(`/audio-call?participant=${encodeURIComponent(activeChat.name)}&id=${activeChat.id}`)
    }
  }

  const handleEmojiSelect = (emoji) => {
    const input = chatInputRef.current
    if (input) {
      const start = input.selectionStart
      const end = input.selectionEnd
      const newMessage = message.slice(0, start) + emoji + message.slice(end)
      setMessage(newMessage)

      // Set cursor position after emoji
      setTimeout(() => {
        input.focus()
        input.setSelectionRange(start + emoji.length, start + emoji.length)
      }, 0)
    } else {
      setMessage((prev) => prev + emoji)
    }

    // Update recent emojis
    setRecentEmojis((prev) => {
      const newRecent = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 5)
      return newRecent
    })

    // Don't close emoji picker - let user continue selecting emojis
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)

    files.forEach((file) => {
      // Validate file type and size
      const validTypes = {
        image: ["image/jpeg", "image/png", "image/jpg"],
        video: ["video/mp4", "video/mov", "video/avi"],
        document: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ],
      }

      const maxSizes = {
        image: 10 * 1024 * 1024, // 10MB
        video: 50 * 1024 * 1024, // 50MB
        document: 25 * 1024 * 1024, // 25MB
      }

      let fileType = "document"
      if (validTypes.image.includes(file.type)) fileType = "image"
      else if (validTypes.video.includes(file.type)) fileType = "video"

      if (file.size > maxSizes[fileType]) {
        alert(`File too large. Maximum size for ${fileType}s is ${maxSizes[fileType] / (1024 * 1024)}MB`)
        return
      }

      // Simulate file upload
      const fileId = Date.now() + Math.random()
      setUploadingFiles((prev) => [...prev, { id: fileId, name: file.name, progress: 0 }])

      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadingFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))

        if (progress >= 100) {
          clearInterval(interval)

          // Remove from uploading and add to messages
          setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))

          const newMessage = {
            id: Date.now(),
            senderId: user.id,
            senderName: user.name,
            message: "",
            timestamp: new Date().toISOString(),
            avatar: "/placeholder.svg?height=32&width=32",
            type: fileType,
            fileData: {
              name: file.name,
              size: formatFileSize(file.size),
              url: URL.createObjectURL(file),
              type: file.type,
            },
          }

          setMessages((prev) => ({
            ...prev,
            [activeChat.id]: [...(prev[activeChat.id] || []), newMessage],
          }))

          // Update last message in conversation
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === activeChat.id
                ? {
                    ...conv,
                    lastMessage: `📎 ${file.name}`,
                    lastMessageTime: new Date().toISOString(),
                  }
                : conv,
            ),
          )
        }
      }, 200)
    })

    // Reset file input
    event.target.value = ""
    setShowFileUpload(false)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getFilteredEmojis = () => {
    const categoryEmojis = emojiCategories[selectedEmojiCategory]?.emojis || []
    if (!emojiSearchQuery) return categoryEmojis

    return categoryEmojis.filter((emoji) =>
      // This is a simple filter - in a real app you'd have emoji names/keywords
      emoji.includes(emojiSearchQuery),
    )
  }

  const renderMessage = (msg) => {
    switch (msg.type) {
      case "image":
        return (
          <div className="message-file image-message">
            <img src={msg.fileData.url || "/placeholder.svg"} alt={msg.fileData.name} className="message-image" />
            <div className="file-info">
              <span className="file-name">{msg.fileData.name}</span>
              <span className="file-size">{msg.fileData.size}</span>
            </div>
          </div>
        )

      case "video":
        return (
          <div className="message-file video-message">
            <div className="video-thumbnail">
              <video src={msg.fileData.url} className="message-video" />
              <div className="video-overlay">
                <Play size={24} />
              </div>
            </div>
            <div className="file-info">
              <span className="file-name">{msg.fileData.name}</span>
              <span className="file-size">{msg.fileData.size}</span>
            </div>
          </div>
        )

      case "file":
        const getFileIcon = (type) => {
          if (type?.includes("pdf")) return <FileText size={24} color="#e53e3e" />
          if (type?.includes("word")) return <FileText size={24} color="#2b6cb0" />
          return <FileText size={24} color="#4a5568" />
        }

        return (
          <div className="message-file document-message">
            <div className="file-icon">{getFileIcon(msg.fileData.type)}</div>
            <div className="file-info">
              <span className="file-name">{msg.fileData.name}</span>
              <span className="file-size">{msg.fileData.size}</span>
            </div>
            <button className="download-btn">
              <Download size={16} />
            </button>
          </div>
        )

      default:
        return <p>{msg.message}</p>
    }
  }

  return (
    <div className="chats-page">
      <div className={`chats-sidebar ${showMobileChat ? "mobile-hidden" : ""}`}>
        <div className="chats-header">
          <h2>Messages</h2>
          <button className="new-chat-btn">
            <Plus size={20} />
          </button>
        </div>

        <div className="chat-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="conversations-list">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${activeChat?.id === conversation.id ? "active" : ""}`}
              onClick={() => handleConversationClick(conversation)}
            >
              <div className="conversation-avatar">
                <img src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                {conversation.type === "direct" && conversation.isOnline && <div className="online-indicator"></div>}
                {conversation.type === "group" && (
                  <div className="group-indicator">
                    <Users size={12} />
                  </div>
                )}
              </div>

              <div className="conversation-info">
                <div className="conversation-header">
                  <h3>{conversation.name}</h3>
                  <span className="last-message-time">{formatTime(conversation.lastMessageTime)}</span>
                </div>
                <div className="conversation-preview">
                  <p>{conversation.lastMessage}</p>
                  {conversation.unreadCount > 0 && <span className="unread-badge">{conversation.unreadCount}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`chat-main ${!showMobileChat ? "mobile-hidden" : ""}`}>
        {activeChat ? (
          <>
            <div className="chat-header">
              <div className="chat-header-info">
                <button className="mobile-back-btn" onClick={handleBackToList}>
                  <ArrowLeft size={20} />
                </button>
                <div className="chat-avatar">
                  <img src={activeChat.avatar || "/placeholder.svg"} alt={activeChat.name} />
                  {activeChat.type === "direct" && activeChat.isOnline && <div className="online-indicator"></div>}
                </div>
                <div className="chat-details">
                  <h3>{activeChat.name}</h3>
                  <p>
                    {activeChat.type === "group"
                      ? `${activeChat.memberCount} members`
                      : activeChat.isOnline
                        ? "Online"
                        : "Last seen recently"}
                  </p>
                </div>
              </div>

              <div className="chat-actions">
                <button className="chat-action-btn" onClick={handleAudioCall} title="Audio Call">
                  <Phone size={20} />
                </button>
                <button className="chat-action-btn" onClick={handleVideoCall} title="Video Call">
                  <Video size={20} />
                </button>
                <button className="chat-action-btn" title="More Options">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {(messages[activeChat.id] || []).map((msg) => (
                <div key={msg.id} className={`message ${msg.senderId === user.id ? "own-message" : ""}`}>
                  {msg.senderId !== user.id && (
                    <div className="message-avatar">
                      <img src={msg.avatar || "/placeholder.svg"} alt={msg.senderName} />
                    </div>
                  )}
                  <div className="message-content">
                    {msg.senderId !== user.id && activeChat.type === "group" && (
                      <div className="message-sender">{msg.senderName}</div>
                    )}
                    <div className="message-bubble">
                      {renderMessage(msg)}
                      <span className="message-time">{formatMessageTime(msg.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Show uploading files */}
              {uploadingFiles.map((file) => (
                <div key={file.id} className="message own-message">
                  <div className="message-content">
                    <div className="message-bubble">
                      <div className="uploading-file">
                        <div className="file-info">
                          <span className="file-name">{file.name}</span>
                          <div className="upload-progress">
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${file.progress}%` }}></div>
                            </div>
                            <span className="progress-text">{file.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <div className="chat-input-container">
                <div className="input-actions">
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowFileUpload(!showFileUpload)}
                    title="Attach File"
                  >
                    <Paperclip size={20} />
                  </button>

                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    title="Add Emoji"
                  >
                    <Smile size={20} />
                  </button>
                </div>

                <input
                  ref={chatInputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="chat-input"
                />

                <button type="submit" className="send-btn" disabled={!message.trim()}>
                  <Send size={20} />
                </button>
              </div>

              {/* File Upload Options */}
              {showFileUpload && (
                <div className="file-upload-options">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="file-option"
                    onClick={() => {
                      fileInputRef.current.accept = "image/*"
                      fileInputRef.current.click()
                    }}
                  >
                    <ImageIcon size={20} />
                    <span>Photos</span>
                  </button>
                  <button
                    type="button"
                    className="file-option"
                    onClick={() => {
                      fileInputRef.current.accept = "video/*"
                      fileInputRef.current.click()
                    }}
                  >
                    <Film size={20} />
                    <span>Videos</span>
                  </button>
                  <button
                    type="button"
                    className="file-option"
                    onClick={() => {
                      fileInputRef.current.accept = ".pdf,.docx,.txt"
                      fileInputRef.current.click()
                    }}
                  >
                    <FileText size={20} />
                    <span>Documents</span>
                  </button>
                </div>
              )}

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="emoji-picker" ref={emojiPickerRef}>
                  <div className="emoji-picker-header">
                    <input
                      type="text"
                      placeholder="Search emojis..."
                      value={emojiSearchQuery}
                      onChange={(e) => setEmojiSearchQuery(e.target.value)}
                      className="emoji-search"
                    />
                    <button className="emoji-close" onClick={() => setShowEmojiPicker(false)}>
                      <X size={16} />
                    </button>
                  </div>

                  {/* Recent Emojis */}
                  {recentEmojis.length > 0 && (
                    <div className="emoji-section">
                      <div className="emoji-section-title">Recently Used</div>
                      <div className="emoji-grid">
                        {recentEmojis.map((emoji, index) => (
                          <button
                            key={`recent-${index}`}
                            type="button"
                            className="emoji-btn"
                            onClick={() => handleEmojiSelect(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Tabs */}
                  <div className="emoji-categories">
                    {Object.entries(emojiCategories).map(([key, category]) => (
                      <button
                        key={key}
                        type="button"
                        className={`emoji-category-btn ${selectedEmojiCategory === key ? "active" : ""}`}
                        onClick={() => setSelectedEmojiCategory(key)}
                        title={category.name}
                      >
                        {category.emojis[0]}
                      </button>
                    ))}
                  </div>

                  {/* Emoji Grid */}
                  <div className="emoji-section">
                    <div className="emoji-section-title">{emojiCategories[selectedEmojiCategory]?.name}</div>
                    <div className="emoji-grid">
                      {getFilteredEmojis().map((emoji, index) => (
                        <button
                          key={`${selectedEmojiCategory}-${index}`}
                          type="button"
                          className="emoji-btn"
                          onClick={() => handleEmojiSelect(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <MessageSquare size={64} />
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the sidebar to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chats
