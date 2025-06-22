"use client"

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import axios from 'axios'
import {
  Search, Plus, MessageSquare, Users, Video, Phone, MoreVertical, Smile,
  Paperclip, Send, X, Download, FileText, ImageIcon, Film, ArrowLeft, Link, Copy, Check, Settings, UserPlus, Bell, Archive, Trash2
} from 'lucide-react'
import './Chats.css'

const Chats = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [activeChat, setActiveChat] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [message, setMessage] = useState('')
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({})
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState([])
  const [emojiSearchQuery, setEmojiSearchQuery] = useState('')
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('smileys')
  const [recentEmojis, setRecentEmojis] = useState(['😊', '👍', '❤️', '😂', '🎉'])
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [imageModal, setImageModal] = useState({ isOpen: false, src: '', name: '' })
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [showGroupLinkModal, setShowGroupLinkModal] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [error, setError] = useState(null)
  const [ws, setWs] = useState(null)

  const fileInputRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const chatInputRef = useRef(null)
  const moreOptionsRef = useRef(null)
  const wsRef = useRef(null);


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

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return null
  }

  const api = axios.create({
    baseURL: 'https://127.0.0.1:8000/chats/',
    withCredentials: true,
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    },
  })

  useEffect(() => {
    if (activeChat && user) {
      const accessToken = getCookie('access_token')
      const websocket = new WebSocket(`wss://127.0.0.1:8000/chats/ws/chat/?access_token=${accessToken}`)
      
      websocket.onopen = () => {
        console.log('WebSocket connected')
        const joinData = activeChat.type === 'group'
          ? { type: 'join_room', group_id: activeChat.id }
          : { type: 'join_room', recipient_id: activeChat.id }
        websocket.send(JSON.stringify(joinData))
      }

      websocket.onmessage = (e) => {
        const data = JSON.parse(e.data)
        if (data.type === 'message') {
          const msg = data.message
          setMessages(prev => ({
            ...prev,
            [activeChat.id]: [...(prev[activeChat.id] || []), {
              id: msg.id,
              senderId: msg.sender.id,
              senderName: msg.sender.chat_username,
              message: msg.content,
              timestamp: msg.timestamp,
              avatar: '/placeholder.svg?height=32&width=32',
              type: msg.message_type.toLowerCase(),
              fileData: msg.file ? {
                name: msg.file.split('/').pop(),
                size: 'Unknown',
                url: msg.file,
                type: msg.message_type.toLowerCase(),
              } : null,
            }],
          }))
        }
      }

      websocket.onclose = () => console.log('WebSocket disconnected')
      websocket.onerror = (err) => {
        setError('WebSocket connection failed')
        console.error('WebSocket error:', err)
      }

      setWs(websocket)
      return () => websocket.close()
    }
  }, [activeChat, user])

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) setShowEmojiPicker(false)
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target)) setShowMoreOptions(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchConversations = async () => {
    try {
      setError(null)
      const groupResponse = await api.get('groups/')
      const groups = groupResponse.data.map(group => ({
        id: group.id,
        type: 'group',
        name: group.name,
        avatar: group.icon || '/placeholder.svg?height=40&width=40',
        lastMessage: group.last_message_timestamp ? `Last message at ${new Date(group.last_message_timestamp).toLocaleString()}` : 'No messages',
        lastMessageTime: group.last_message_timestamp,
        unreadCount: 0,
        memberCount: group.members.length,
        groupLink: group.invite_link,
        isPrivate: group.status === 'PRIVATE',
      }))

      const dmResponse = await api.get('users/search/?q=')
      const dms = dmResponse.data.map(chatUser => ({
        id: chatUser.id,
        type: 'direct',
        name: chatUser.chat_username,
        avatar: '/placeholder.svg?height=40&width=40',
        lastMessage: 'Start a conversation',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        isOnline: chatUser.is_online,
      }))

      setConversations([...groups, ...dms])
    } catch (err) {
      setError('Failed to load conversations')
      console.error(err)
    }
  }


  const fetchMessages = async (conversation) => {
    try {
      setError(null)
      let response
      console.log('Fetching messages for conversation:', conversation)
      if (conversation.type === 'group') {
        response = await api.get(`groups/${conversation.id}/messages/`)
      } else {
        response = await api.get(`dm/${conversation.id}/messages/`)
      }
      console.log('Messages response:', response.data)
      // Handle both paginated and non-paginated responses
      const messages = response.data.results || response.data || []
      const fetchedMessages = messages.map(msg => ({
        id: msg.id,
        senderId: msg.sender.id,
        senderName: msg.sender.chat_username,
        message: msg.content,
        timestamp: msg.timestamp,
        avatar: '/placeholder.svg?height=32&width=32',
        type: msg.message_type.toLowerCase(),
        fileData: msg.file ? {
          name: msg.file.split('/').pop(),
          size: 'Unknown',
          url: msg.file,
          type: msg.message_type.toLowerCase(),
        } : null,
      }))
      setMessages(prev => ({ ...prev, [conversation.id]: fetchedMessages }))
    } catch (err) {
      console.error('Fetch messages error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
      })
      setError(`Failed to load messages: ${err.response?.status || err.message}`)
    }
  }


  
  const deleteMessage = async (messageId) => {
    try {
      setError(null)
      const csrfToken = getCookie('csrftoken')
      await api.delete(`messages/${messageId}/delete/`, {
        headers: { 'X-CSRFToken': csrfToken },
      })
      setMessages(prev => {
        const updated = { ...prev }
        for (const convId in updated) {
          updated[convId] = updated[convId].filter(msg => msg.id !== messageId)
        }
        return updated
      })
    } catch (err) {
      setError('Failed to delete message')
      console.error(err)
    }
  }

  const handleConversationClick = (conversation) => {
    setActiveChat(conversation)
    setShowMobileChat(true)
    fetchMessages(conversation)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !activeChat || !ws || ws.readyState !== WebSocket.OPEN) return

    try {
      setError(null)
      const messageData = {
        type: 'message',
        content: message.trim(),
        message_type: 'TEXT',
        ...(activeChat.type === 'group' ? { group_id: activeChat.id } : { recipient_id: activeChat.id }),
      }
      ws.send(JSON.stringify(messageData))
      setMessage('')
      setShowEmojiPicker(false)
    } catch (err) {
      setError('Failed to send message')
      console.error(err)
    }
  }

  const handleFileUpload = async (file, fileType, fileId) => {
    try {
      const csrfToken = getCookie('csrftoken');
      const formData = new FormData();
      // Sanitize filename to avoid issues with special characters
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      formData.append('file', file, sanitizedName);
      formData.append('message_type', fileType.toUpperCase());
      let endpoint = '';
      if (activeChat.type === 'group') {
        endpoint = `groups/${activeChat.id}/messages/`;
      } else {
        endpoint = `dm/${activeChat.id}/messages/`;
      }
      console.log('Uploading file:', {
        fileName: file.name,
        sanitizedName,
        fileType,
        formData: [...formData.entries()],
      });

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress } : f));
        },
      });
      console.log('Upload response:', response.data);
      const { id, content, file: fileUrl, message_type, timestamp } = response.data;
      const messageData = {
        type: 'message',
        content: content || '',
        message_type,
        file_url: fileUrl,
        ...(activeChat.type === 'group' ? { group_id: activeChat.id } : { recipient_id: activeChat.id }),
      };
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(messageData));
      } else {
        console.warn('WebSocket not connected, cannot send file message');
      }

      setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (err) {
      console.error('File upload error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
      });
      setError(`Failed to upload ${file.name}: ${err.response?.data?.detail || err.response?.data?.file || err.message}`);
      setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };




  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const getFilteredEmojis = () => {
    const categoryEmojis = emojiCategories[selectedEmojiCategory]?.emojis || []
    if (!emojiSearchQuery) return categoryEmojis
    return categoryEmojis.filter(emoji => emoji.includes(emojiSearchQuery))
  }

  const renderMessage = (msg) => {
    const handleDelete = (e) => {
      e.stopPropagation()
      if (window.confirm('Delete this message?')) {
        deleteMessage(msg.id)
      }
    }

    switch (msg.type) {
      case 'image':
        return (
          <div className="message-file image-message">
            <img
              src={msg.fileData.url || '/placeholder.svg'}
              alt={msg.fileData.name}
              className="message-image"
              onClick={() => setImageModal({ isOpen: true, src: msg.fileData.url, name: msg.fileData.name })}
            />
            <div className="file-info">
              <span className="file-name">{msg.fileData.name}</span>
              <span className="file-size">{msg.fileData.size}</span>
              {msg.senderId === user.id && (
                <button className="delete-btn" onClick={handleDelete} title="Delete">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        )
      case 'video':
        return (
          <div className="message-file video-message">
            <div className="video-container">
              <video src={msg.fileData.url} className="message-video" controls preload="metadata" onClick={(e) => e.stopPropagation()}>
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="file-info">
              <span className="file-name">{msg.fileData.name}</span>
              <span className="file-size">{msg.fileData.size}</span>
              {msg.senderId === user.id && (
                <button className="delete-btn" onClick={handleDelete} title="Delete">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        )
      case 'file':
        const getFileIcon = (type) => {
          if (type?.includes('pdf')) return <FileText size={24} color="#e53e3e" />
          if (type?.includes('word') || type?.includes('document')) return <FileText size={24} color="#2b6cb0" />
          if (type?.includes('text')) return <FileText size={24} color="#4a5568" />
          return <FileText size={24} color="#4a5568" />
        }
        const getFileTypeLabel = (type) => {
          if (type?.includes('pdf')) return 'PDF'
          if (type?.includes('word') || type?.includes('document')) return 'DOCX'
          if (type?.includes('text')) return 'TXT'
          return 'FILE'
        }
        const handleDocumentClick = () => {
          if (msg.fileData.url) window.open(msg.fileData.url, '_blank')
        }
        const handleDownload = (e) => {
          e.stopPropagation()
          if (msg.fileData.url) {
            const link = document.createElement('a')
            link.href = msg.fileData.url
            link.download = msg.fileData.name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        }
        return (
          <div className="message-file document-message" onClick={handleDocumentClick}>
            <div className="file-icon">{getFileIcon(msg.fileData.type)}</div>
            <div className="file-info">
              <div className="file-header">
                <span className="file-name">{msg.fileData.name}</span>
                <span className="file-type-label">{getFileTypeLabel(msg.fileData.type)}</span>
              </div>
              <span className="file-size">{msg.fileData.size}</span>
              <span className="file-action-hint">Click to open</span>
              {msg.senderId === user.id && (
                <button className="delete-btn" onClick={handleDelete} title="Delete">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <button className="download-btn" onClick={handleDownload} title="Download">
              <Download size={16} />
            </button>
          </div>
        )
      default:
        return (
          <div className="text-message">
            <p>{msg.message}</p>
            {msg.senderId === user.id && (
              <button className="delete-btn" onClick={handleDelete} title="Delete">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )
    }
  }

  const handleEmojiSelect = (emoji) => {
    const input = chatInputRef.current
    if (input) {
      const start = input.selectionStart
      const end = input.selectionEnd
      const newMessage = message.slice(0, start) + emoji + message.slice(end)
      setMessage(newMessage)
      setTimeout(() => {
        input.focus()
        input.setSelectionRange(start + emoji.length, start + emoji.length)
      }, 0)
    } else {
      setMessage(prev => prev + emoji)
    }
    setRecentEmojis(prev => {
      const newRecent = [emoji, ...prev.filter(e => e !== emoji)].slice(0, 5)
      return newRecent
    })
  }

  const handleBackToList = () => {
    setShowMobileChat(false)
    setActiveChat(null)
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

  const handleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions)
  }

  const handleGroupLink = () => {
    if (activeChat && activeChat.type === 'group') {
      setShowGroupLinkModal(true)
      setShowMoreOptions(false)
    }
  }

  const handleCopyGroupLink = async () => {
    if (activeChat && activeChat.groupLink) {
      try {
        await navigator.clipboard.writeText(activeChat.groupLink)
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
      } catch (err) {
        const textArea = document.createElement('textarea')
        textArea.value = activeChat.groupLink
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
      }
    }
  }

  return (
    <div className="chats-page">
      {error && <div className="error-message">{error}</div>}
      <div className={`chats-sidebar ${showMobileChat ? 'mobile-hidden' : ''}`}>
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
          {conversations.filter(conv => conv.name.toLowerCase().includes(searchQuery.toLowerCase())).map(conversation => (
            <div
              key={conversation.id}
              className={`conversation-item ${activeChat?.id === conversation.id ? 'active' : ''}`}
              onClick={() => handleConversationClick(conversation)}
            >
              <div className="conversation-avatar">
                <img src={conversation.avatar || '/placeholder.svg'} alt={conversation.name} />
                {conversation.type === 'direct' && conversation.isOnline && <div className="online-indicator"></div>}
                {conversation.type === 'group' && (
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
      <div className={`chat-main ${!showMobileChat ? 'mobile-hidden' : ''}`}>
        {activeChat ? (
          <>
            <div className="chat-header">
              <div className="chat-header-info">
                <button className="mobile-back-btn" onClick={handleBackToList}>
                  <ArrowLeft size={20} />
                </button>
                <div className="chat-avatar">
                  <img src={activeChat.avatar || '/placeholder.svg'} alt={activeChat.name} />
                  {activeChat.type === 'direct' && activeChat.isOnline && <div className="online-indicator"></div>}
                </div>
                <div className="chat-details">
                  <h3>{activeChat.name}</h3>
                  <p>
                    {activeChat.type === 'group'
                      ? `${activeChat.memberCount} members`
                      : activeChat.isOnline
                      ? 'Online'
                      : 'Last seen recently'}
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
                <div className="more-options-container" ref={moreOptionsRef}>
                  <button className="chat-action-btn" onClick={handleMoreOptions} title="More Options">
                    <MoreVertical size={20} />
                  </button>
                  {showMoreOptions && (
                    <div className="more-options-dropdown">
                      {activeChat.type === 'group' && (
                        <>
                          <button className="dropdown-item" onClick={handleGroupLink}>
                            <Link size={16} />
                            <span>Group Link</span>
                          </button>
                          <button className="dropdown-item">
                            <UserPlus size={16} />
                            <span>Add Members</span>
                          </button>
                          <button className="dropdown-item">
                            <Settings size={16} />
                            <span>Group Settings</span>
                          </button>
                          <div className="dropdown-divider"></div>
                        </>
                      )}
                      <button className="dropdown-item">
                        <Bell size={16} />
                        <span>Mute Notifications</span>
                      </button>
                      <button className="dropdown-item">
                        <Archive size={16} />
                        <span>Archive Chat</span>
                      </button>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item danger">
                        <Trash2 size={16} />
                        <span>Delete Chat</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="chat-messages">
              {(messages[activeChat.id] || []).map(msg => (
                <div key={msg.id} className={`message ${msg.senderId === user.id ? 'own-message' : ''}`}>
                  {msg.senderId !== user.id && (
                    <div className="message-avatar">
                      <img src={msg.avatar || '/placeholder.svg'} alt={msg.senderName} />
                    </div>
                  )}
                  <div className="message-content">
                    {msg.senderId !== user.id && activeChat.type === 'group' && (
                      <div className="message-sender">{msg.senderName}</div>
                    )}
                    <div className="message-bubble">
                      {renderMessage(msg)}
                      <span className="message-time">{formatMessageTime(msg.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {uploadingFiles.map(file => (
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
              {showFileUpload && (
                <div className="file-upload-options">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.docx,.txt"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const fileType = fileInputRef.current.accept.includes('image')
                        ? 'image'
                        : fileInputRef.current.accept.includes('video')
                        ? 'video'
                        : 'document';

                      files.forEach((file) => {
                        const uniqueId = crypto.randomUUID(); // or your ID generator
                        handleFileUpload(file, fileType, uniqueId);
                      });

                      // Optional: reset the input so you can re-select same file
                      fileInputRef.current.value = '';
                    }}
                    style={{ display: 'none' }}
                  />

                  <button
                    type="button"
                    className="file-option"
                    onClick={() => {
                      fileInputRef.current.accept = 'image/*'
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
                      fileInputRef.current.accept = 'video/*'
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
                      fileInputRef.current.accept = '.pdf,.docx,.txt'
                      fileInputRef.current.click()
                    }}
                  >
                    <FileText size={20} />
                    <span>Documents</span>
                  </button>
                </div>
              )}
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
                  <div className="emoji-categories">
                    {Object.entries(emojiCategories).map(([key, category]) => (
                      <button
                        key={key}
                        type="button"
                        className={`emoji-category-btn ${selectedEmojiCategory === key ? 'active' : ''}`}
                        onClick={() => setSelectedEmojiCategory(key)}
                        title={category.name}
                      >
                        {category.emojis[0]}
                      </button>
                    ))}
                  </div>
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
        {imageModal.isOpen && (
          <div className="image-modal-overlay" onClick={() => setImageModal({ isOpen: false, src: '', name: '' })}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="image-modal-header">
                <span className="image-modal-title">{imageModal.name}</span>
                <div className="image-modal-actions">
                  <button
                    className="image-modal-download"
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = imageModal.src
                      link.download = imageModal.name
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                    title="Download"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    className="image-modal-close"
                    onClick={() => setImageModal({ isOpen: false, src: '', name: '' })}
                    title="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="image-modal-body">
                <img src={imageModal.src || '/placeholder.svg'} alt={imageModal.name} className="modal-image" />
              </div>
            </div>
          </div>
        )}
        {showGroupLinkModal && activeChat && activeChat.type === 'group' && (
          <div className="link-group-link-modal-overlay" onClick={() => setShowGroupLinkModal(false)}>
            <div className="link-group-link-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="link-group-link-modal-header">
                <h3>Group Link</h3>
                <button className="link-modal-close-btn" onClick={() => setShowGroupLinkModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="link-group-link-modal-body">
                <div className="link-group-info">
                  <div className="link-group-avatar-small">
                    <img src={activeChat.avatar || '/placeholder.svg'} alt={activeChat.name} />
                  </div>
                  <div className="link-group-details-small">
                    <h4>{activeChat.name}</h4>
                    <p>{activeChat.memberCount} members</p>
                  </div>
                </div>
                <div className="link-link-section">
                  <label>Share this link to invite people to this group:</label>
                  <div className="link-link-input-container">
                    <input type="text" value={activeChat.groupLink || ''} readOnly className="group-link-input" />
                    <button
                      className={`link-copy-link-btn ${linkCopied ? 'copied' : ''}`}
                      onClick={handleCopyGroupLink}
                      title={linkCopied ? 'Copied!' : 'Copy Link'}
                    >
                      {linkCopied ? <Check size={16} /> : <Copy size={16} />}
                      {linkCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  {linkCopied && <p className="link-copy-success">Link copied to clipboard!</p>}
                </div>
                <div className="link-link-info">
                  <p className="link-link-note">
                    {activeChat.isPrivate
                      ? '🔒 This is a private group. Only people with this link can join.'
                      : '🌐 This is a public group. Anyone with this link can join.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chats