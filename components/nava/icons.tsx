import { config } from "@fortawesome/fontawesome-svg-core";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faAnglesLeft,
  faAnglesRight,
  faArrowRight,
  faArrowUpRightFromSquare,
  faAt,
  faBell,
  faCalendar,
  faCalendarDays,
  faChartColumn,
  faCheck,
  faChevronDown,
  faChevronRight,
  faCircleCheck,
  faCircleInfo,
  faCircleQuestion,
  faCircleUser,
  faClock,
  faCloudArrowUp,
  faCode,
  faComment,
  faCreditCard,
  faEnvelope,
  faEye,
  faFilter,
  faFlask,
  faFolderOpen,
  faGear,
  faGrip,
  faHand,
  faHashtag,
  faHeart,
  faImage,
  faInbox,
  faLightbulb,
  faLock,
  faMagnifyingGlass,
  faMessage,
  faMoneyBill1,
  faPaperPlane,
  faPen,
  faPenToSquare,
  faPlus,
  faShieldHalved,
  faTableCellsLarge,
  faTag,
  faUserGroup,
  faUsers,
  faWallet,
  faWandMagicSparkles,
  faXmark,
  faBolt,
  faRightFromBracket,
  faDiagramProject,
  faFaceSmile,
  faBox,
  faChevronLeft,
  faFileLines,
  faFilm,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import {
  faDropbox,
  faFacebook,
  faGoogleDrive,
  faInstagram,
  faLinkedin,
  faMicrosoft,
  faThreads,
  faXTwitter,
  faBluesky,
  faSubstack,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

// Sizing comes from Tailwind classes, so FontAwesome's own stylesheet is not injected.
config.autoAddCss = false;

type IconProps = {
  className?: string;
  color?: string;
  title?: string;
};

function make(icon: IconDefinition) {
  function Icon({ className, color, title }: IconProps) {
    return (
      <FontAwesomeIcon
        icon={icon}
        className={className}
        color={color}
        title={title}
        aria-hidden={title ? undefined : true}
        fixedWidth
      />
    );
  }
  return Icon;
}

export const ArrowRight = make(faArrowRight);
export const ArrowUpRight = make(faArrowUpRightFromSquare);
export const AtSign = make(faAt);
export const BadgeDollarSign = make(faMoneyBill1);
export const Bell = make(faBell);
export const CalendarDays = make(faCalendarDays);
export const CalendarRange = make(faCalendar);
export const ChartColumnBig = make(faChartColumn);
export const BarChart3 = ChartColumnBig;
export const Check = make(faCheck);
export const CheckCircle2 = make(faCircleCheck);
export const ChevronDown = make(faChevronDown);
export const ChevronRight = make(faChevronRight);
export const CircleHelp = make(faCircleQuestion);
export const CircleUserRound = make(faCircleUser);
export const Clock3 = make(faClock);
export const CloudUpload = make(faCloudArrowUp);
export const CodeXml = make(faCode);
export const CreditCard = make(faCreditCard);
export const Eye = make(faEye);
export const FlaskConical = make(faFlask);
export const FolderKanban = make(faFolderOpen);
export const Funnel = make(faFilter);
export const WaveHand = make(faHand);
export const Hash = make(faHashtag);
export const Heart = make(faHeart);
export const ImagePlus = make(faImage);
export const Inbox = make(faInbox);
export const Info = make(faCircleInfo);
export const LayoutDashboard = make(faTableCellsLarge);
export const LayoutGrid = make(faGrip);
export const Lightbulb = make(faLightbulb);
export const Lock = make(faLock);
export const LogOut = make(faRightFromBracket);
export const Mail = make(faEnvelope);
export const MessageCircle = make(faComment);
export const MessageSquareText = make(faMessage);
export const PanelLeftClose = make(faAnglesLeft);
export const PanelLeftOpen = make(faAnglesRight);
export const Pencil = make(faPen);
export const PenLine = make(faPenToSquare);
export const Plus = make(faPlus);
export const Search = make(faMagnifyingGlass);
export const Send = make(faPaperPlane);
export const Settings = make(faGear);
export const ShieldCheck = make(faShieldHalved);
export const Smile = make(faFaceSmile);
export const Sparkles = make(faWandMagicSparkles);
export const Tag = make(faTag);
export const UserRoundSearch = make(faAddressBook);
export const UsersRound = make(faUserGroup);
export const Users = make(faUsers);
export const WalletCards = make(faWallet);
export const Workflow = make(faDiagramProject);
export const X = make(faXmark);
export const Zap = make(faBolt);

export const Facebook = make(faFacebook);
export const Instagram = make(faInstagram);
export const Linkedin = make(faLinkedin);
export const Threads = make(faThreads);
export const XTwitter = make(faXTwitter);
export const Bluesky = make(faBluesky);
export const Substack = make(faSubstack);
export const Tiktok = make(faTiktok);
export const Youtube = make(faYoutube);
export const ChevronLeft = make(faChevronLeft);
export const FileText = make(faFileLines);
export const Film = make(faFilm);
export const Palette = make(faPalette);
export const Box = make(faBox);
export const GoogleDrive = make(faGoogleDrive);
export const Dropbox = make(faDropbox);
export const Microsoft = make(faMicrosoft);
