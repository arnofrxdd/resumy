import React, { useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import { useSectionContext } from "../common/SectionContext";
import { useAutoPagination } from "../../hooks/useAutoPagination";
import {
    SpellCheckText,
    SplittableRichText,
    RichTextSpellCheck,
    LanguageItem,
    CertificationItem,
    SoftwareItem,
    ResumeLink,
} from "../common/BaseComponents";
import { Phone, Mail, Globe, Linkedin, Github, MapPin, User, Star, Link, Users, Award } from "lucide-react";
import { getCompleteLayout, getSavedLayout } from "../common/TemplateUtils";

/**
 * DarkSpark Template
 * Matches the dark sidebar + white main layout:
 * - Sidebar: dark charcoal bg, yellow accent stripe on left, diagonal geometric top, circular photo
 * - Sidebar sections: yellow badge icons + white uppercase bold titles, dashed dividers
 * - Main: white bg, name (first dark + last in yellow), profession in gray
 * - Main sections: yellow circle badge + dark bold title
 * - Experience: title bold + date right, company italic, description
 * - Skills: 2-col horizontal progress bar layout
 * - Full CSS variable spacing support
 */
const AmberGraphite = ({
    data,
    onSectionClick,
    onReorder,
    scale = 1,
    isSpellCheckActive,
    onSpellCheckIgnore,
    onSpellCheckReplace,
    layoutConfig,
    showPageBreaks,
}) => {
    const containerRef = useRef(null);

    if (!data) return null;
    const { personal } = data;
    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    // --- LAYOUT ENGINE ---
    const templateId = "amber-graphite";
    const initialLayout = getSavedLayout(data, templateId, {
        sidebar: ["contact", "personalDetails", "references", "education", "languages", "certifications", "websites", "interests", "awards"],
        main: ["summary", "experience", "skills", "strengths", "additionalSkills", "software", "projects", "custom", "additionalInfo", "volunteer", "publications"],
    });
    const completeLayout = getCompleteLayout(data, initialLayout, "main");
    const activeMainSections = completeLayout.main || [];
    const activeSidebarSections = completeLayout.sidebar || [];

    // --- DND ---
    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: { main: activeMainSections, sidebar: activeSidebarSections },
    });

    // --- PAGINATION ---
    const pages = useAutoPagination({
        columns: { main: activeMainSections, sidebar: activeSidebarSections },
        data,
        enabled: showPageBreaks,
        containerRef,
        scale,
    });

    // --- COLORS ---
    const YELLOW = "var(--theme-color, #f5a623)";
    const DARK = "#2b2b2b";
    const SIDEBAR_BG = "#2d2d2d";
    const SIDEBAR_W = "33%";
    const MAIN_W = "67%";

    // Helper: split name into first + last for two-tone display
    const splitName = (name) => {
        if (!name) return { first: "BRIAN R.", last: "BAXTER" };
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return { first: "", last: parts[0] };
        const last = parts[parts.length - 1];
        const first = parts.slice(0, -1).join(" ");
        return { first, last };
    };

    // --- STYLES ---
    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "white",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            fontFamily: "var(--theme-font, 'Arial', sans-serif)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
        },

        // ===== SIDEBAR =====
        sidebarColumn: {
            width: SIDEBAR_W,
            background: SIDEBAR_BG,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            flexShrink: 0,
            // Yellow left accent stripe
            borderLeft: `5px solid ${YELLOW}`,
            boxSizing: "border-box",
        },
        // Diagonal geometric top accent (yellow + dark triangle)
        sidebarTopGeometric: {
            position: "relative",
            width: "100%",
            height: "160px",
            flexShrink: 0,
            overflow: "hidden",
        },
        sidebarTopDark: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: DARK,
            // Clip with diagonal: bottom-right cut
            clipPath: "polygon(0 0, 100% 0, 100% 55%, 0 100%)",
        },
        sidebarTopYellow: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: YELLOW,
            clipPath: "polygon(0 50%, 100% 0, 100% 100%, 0 100%)",
            zIndex: 1,
        },
        photoContainer: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            overflow: "hidden",
            border: `3px solid ${YELLOW}`,
            background: "#555",
        },
        photoImg: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
        },
        photoPlaceholder: {
            width: "100%",
            height: "100%",
            background: "#555",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#aaa",
            fontSize: "28px",
        },
        sidebarContent: {
            padding: "var(--theme-page-margin, 40px)",
            display: "flex",
            flexDirection: "column",
            gap: "calc(20px * var(--theme-section-margin, 1))",
            flex: 1,
        },
        // Sidebar section title: yellow badge pill + white uppercase bold text
        sidebarTitleRow: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
        },
        sidebarBadge: {
            background: YELLOW,
            borderRadius: "50%",
            width: "22px",
            height: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
        },
        sidebarTitleText: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            fontWeight: "800",
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            fontFamily: "var(--theme-font, 'Arial', sans-serif)",
        },
        sidebarDivider: {
            borderTop: "1px dashed rgba(255,255,255,0.2)",
            margin: "0",
        },
        // Contact items
        contactItem: {
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            marginBottom: "calc(7px * var(--theme-paragraph-margin, 1))",
        },
        contactDot: {
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: "1px",
        },
        contactText: {
            fontSize: "calc(10.5px * var(--theme-font-scale, 1))",
            color: "rgba(255,255,255,0.82)",
            lineHeight: "var(--theme-line-height, 1.45)",
            wordBreak: "break-word",
            flex: 1,
        },
        // Reference items
        refName: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "3px",
        },
        refDetail: {
            fontSize: "calc(10px * var(--theme-font-scale, 1))",
            color: "rgba(255,255,255,0.7)",
            lineHeight: "var(--theme-line-height, 1.4)",
            marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))",
        },
        // Education items in sidebar
        eduName: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "2px",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
        },
        eduDegree: {
            fontSize: "calc(10px * var(--theme-font-scale, 1))",
            color: YELLOW,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "2px",
        },
        eduYear: {
            fontSize: "calc(10px * var(--theme-font-scale, 1))",
            color: "rgba(255,255,255,0.55)",
        },
        eduDot: {
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: YELLOW,
            flexShrink: 0,
            marginTop: "3px",
        },
        // Sidebar skill dot indicator
        sidebarSkillItem: {
            marginBottom: "calc(7px * var(--theme-paragraph-margin, 1))",
            display: "flex",
            alignItems: "center",
            gap: "8px",
        },

        // ===== MAIN COLUMN =====
        mainColumn: {
            flex: 1,
            background: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
        },
        // Header area: light gray bg, name + profession
        mainHeader: {
            background: "#efefef",
            padding: "var(--theme-page-margin, 40px) var(--theme-page-margin, 40px) 20px var(--theme-page-margin, 40px)",
            borderBottom: "1px solid #ddd",
            flexShrink: 0,
        },
        mainNameRow: {
            display: "flex",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: "0 8px",
            marginBottom: "4px",
        },
        mainNameFirst: {
            fontSize: "calc(30px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: DARK,
            textTransform: "uppercase",
            letterSpacing: "1px",
            lineHeight: 1.1,
        },
        mainNameLast: {
            fontSize: "calc(30px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: YELLOW,
            textTransform: "uppercase",
            letterSpacing: "1px",
            lineHeight: 1.1,
        },
        mainProfession: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: "#777",
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontWeight: "400",
        },
        // Main content area (below header)
        mainContent: {
            padding: "20px var(--theme-page-margin, 40px) var(--theme-page-margin, 40px) var(--theme-page-margin, 40px)",
            display: "flex",
            flexDirection: "column",
            gap: "calc(20px * var(--theme-section-margin, 1))",
            flex: 1,
        },
        // Main section title: yellow badge + dark bold text
        mainTitleRow: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "12px",
        },
        mainBadge: {
            background: YELLOW,
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
        },
        mainTitleText: {
            fontSize: "calc(15px * var(--theme-font-scale, 1))",
            fontWeight: "800",
            color: DARK,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
        },
        // Summary text
        summaryText: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.65)",
            color: "#444",
        },
        // Experience item
        expHeaderRow: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "2px",
        },
        expTitle: {
            fontWeight: "700",
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            color: DARK,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
        },
        expDate: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: "#777",
            fontWeight: "400",
            flexShrink: 0,
            marginLeft: "8px",
        },
        expCompany: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: YELLOW,
            fontStyle: "italic",
            marginBottom: "6px",
        },
        expDesc: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.6)",
            color: "#555",
        },
        expItem: {
            marginBottom: "calc(16px * var(--theme-paragraph-margin, 1))",
        },
        // Skills: 2-col progress bar grid
        skillsGrid: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "20px",
            rowGap: "calc(8px * var(--theme-paragraph-margin, 1))",
        },
        skillBarItem: {
            display: "flex",
            flexDirection: "column",
            gap: "3px",
        },
        skillBarLabel: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: "#333",
            fontWeight: "600",
        },
        skillBarTrack: {
            height: "5px",
            background: "#ddd",
            borderRadius: "3px",
            overflow: "hidden",
        },
        skillBarFill: (pct) => ({
            height: "100%",
            width: `${pct}%`,
            background: YELLOW,
            borderRadius: "3px",
        }),
    };

    // --- ICON HELPER ---
    const SidebarIcon = ({ type }) => {
        const s = { color: DARK, width: "11px", height: "11px" };
        switch (type) {
            case "phone": return <Phone style={s} />;
            case "email": return <Mail style={s} />;
            case "linkedin": return <Linkedin style={s} />;
            case "github": return <Github style={s} />;
            case "location": return <MapPin style={s} />;
            case "website": return <Globe style={s} />;
            case "user": return <User style={s} />;
            case "star": return <Star style={s} />;
            case "award": return <Award style={s} />;
            case "users": return <Users style={s} />;
            default: return <Link style={s} />;
        }
    };
    const MainIcon = ({ type }) => {
        const s = { color: DARK, width: "13px", height: "13px" };
        switch (type) {
            case "user": return <User style={s} />;
            case "briefcase": return <User style={s} />;
            case "star": return <Star style={s} />;
            case "award": return <Award style={s} />;
            case "users": return <Users style={s} />;
            default: return <Star style={s} />;
        }
    };

    // --- SECTION TITLE COMPONENTS ---
    const SidebarTitle = ({ title, icon = "user" }) => {
        const { isContinued } = useSectionContext();
        return (
            <div style={styles.sidebarTitleRow}>
                <div style={styles.sidebarBadge}>
                    <SidebarIcon type={icon} />
                </div>
                <span style={styles.sidebarTitleText}>
                    {isContinued ? `${title} (Cont.)` : title}
                </span>
            </div>
        );
    };

    const MainTitle = ({ title, icon = "star" }) => {
        const { isContinued } = useSectionContext();
        return (
            <div style={styles.mainTitleRow}>
                <div style={styles.mainBadge}>
                    <MainIcon type={icon} />
                </div>
                <span style={styles.mainTitleText}>
                    {isContinued ? `${title} (Cont.)` : title}
                </span>
            </div>
        );
    };

    // --- HEADER ---
    const { first: nameFst, last: nameLst } = splitName(personal?.name);
    const Header = () => (
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
            <div style={styles.mainHeader}>
                <div style={styles.mainNameRow}>
                    {nameFst && (
                        <span style={styles.mainNameFirst}>
                            <SpellCheckText
                                text={nameFst}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace("personal", "name", `${val} ${nameLst}`)}
                            />
                        </span>
                    )}
                    <span style={styles.mainNameLast}>
                        <SpellCheckText
                            text={nameLst || personal?.name || "YOUR NAME"}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace("personal", "name", nameFst ? `${nameFst} ${val}` : val)}
                        />
                    </span>
                </div>
                {personal?.profession && (
                    <div style={styles.mainProfession}>
                        <SpellCheckText
                            text={personal.profession}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace("personal", "profession", val)}
                        />
                    </div>
                )}
            </div>
        </SectionWrapper>
    );

    // Sidebar top geometric with photo
    const SidebarTop = () => (
        <div style={styles.sidebarTopGeometric}>
            <div style={styles.sidebarTopDark} />
            <div style={styles.sidebarTopYellow} />
            <div style={styles.photoContainer}>
                {personal?.photo ? (
                    <img src={personal.photo} style={styles.photoImg} alt="profile" />
                ) : (
                    <div style={styles.photoPlaceholder}>
                        <User style={{ width: "36px", height: "36px", color: "#888" }} />
                    </div>
                )}
            </div>
        </div>
    );

    // Skill level → percent (out of 5 → 100%)
    const lvlToPct = (lvl) => {
        if (!lvl) return 70;
        return Math.min(100, (lvl / 5) * 100);
    };

    // --- CUSTOM RENDERERS ---
    const customRenderers = {

        // ======= SIDEBAR RENDERERS =======
        contact: ({ zoneId }) => {
            const websiteItems = data.websites || [];
            const links = [
                { type: "linkedin", value: personal?.linkedin },
                { type: "github", value: personal?.github },
                { type: "website", value: personal?.website },
                ...websiteItems.filter((l) => l.addToHeader && l.url).map((l) => ({ type: "website", value: l.url })),
            ].filter((l) => l.value);
            return (
                <SectionWrapper sectionId="contact" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Contact">
                    <div>
                        <SidebarTitle title="Contact Me" icon="user" />
                        {personal?.phone && (
                            <div style={styles.contactItem}>
                                <div style={styles.contactDot}><SidebarIcon type="phone" /></div>
                                <div style={styles.contactText}>
                                    <ResumeLink href={personal.phone}>
                                        <SpellCheckText text={personal.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("personal", "phone", val)} />
                                    </ResumeLink>
                                    {personal?.phone2 && (
                                        <><br />
                                            <SpellCheckText text={personal.phone2} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("personal", "phone2", val)} />
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        {links.map((link, i) => (
                            <div key={i} style={styles.contactItem}>
                                <div style={styles.contactDot}><SidebarIcon type={link.type} /></div>
                                <div style={styles.contactText}>
                                    <ResumeLink href={link.value}>
                                        <SpellCheckText text={link.value} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("personal", link.type, val)} />
                                    </ResumeLink>
                                </div>
                            </div>
                        ))}
                        {personal?.email && (
                            <div style={styles.contactItem}>
                                <div style={styles.contactDot}><SidebarIcon type="email" /></div>
                                <div style={styles.contactText}>
                                    <ResumeLink href={personal.email}>
                                        <SpellCheckText text={personal.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("personal", "email", val)} />
                                    </ResumeLink>
                                </div>
                            </div>
                        )}
                        {personal?.city && (
                            <div style={styles.contactItem}>
                                <div style={styles.contactDot}><SidebarIcon type="location" /></div>
                                <div style={styles.contactText}>
                                    <SpellCheckText
                                        text={[personal?.city, personal?.state, personal?.zipCode, personal?.country].filter(Boolean).join(", ")}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace("personal", "city", val)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </SectionWrapper>
            );
        },

        websites: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map((idx) => data.websites?.[idx]) : data.websites;
            const portfolioLinks = (items || []).map((link, idx) => ({ ...link, originalIdx: itemIndices ? itemIndices[idx] : idx })).filter((l) => !l.addToHeader && l.url);
            if (portfolioLinks.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");
            return (
                <SectionWrapper sectionId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Websites">
                    {isSidebar ? <SidebarTitle title="Websites" icon="website" /> : <MainTitle title="Websites" icon="star" />}
                    <div style={{ display: "flex", flexDirection: "column", gap: "calc(6px * var(--theme-paragraph-margin, 1))" }}>
                        {portfolioLinks.map((site, i) => (
                            <div key={i} data-item-index={site.originalIdx}>
                                {isSidebar ? (
                                    <div style={styles.contactItem}>
                                        <div style={styles.contactDot}><SidebarIcon type="website" /></div>
                                        <div style={styles.contactText}>
                                            <ResumeLink href={site.url}>
                                                <SpellCheckText text={site.label || site.url} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("websites", site.originalIdx, val, "url")} />
                                            </ResumeLink>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: "#555" }}>
                                        <ResumeLink href={site.url}>
                                            <SpellCheckText text={site.label || site.url} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("websites", site.originalIdx, val, "url")} />
                                        </ResumeLink>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        // "References" section — uses volunteer data or a dedicated references field
        // We treat the "volunteer" section as references in sidebar (common resume pattern)
        // but also keep a dedicated renderer if section is named "references"
        volunteer: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map((idx) => data.volunteer?.[idx]) : data.volunteer;
            if (!items || items.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");
            return (
                <SectionWrapper sectionId="volunteer" onSectionClick={onSectionClick} isInteractive={isInteractive} label={isSidebar ? "References" : "Volunteer"}>
                    <div>
                        {isSidebar ? <SidebarTitle title="References" icon="users" /> : <MainTitle title="Volunteer" icon="users" />}
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(14px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIdx}>
                                        {isSidebar ? (
                                            <>
                                                <div style={styles.refName}>
                                                    <RichTextSpellCheck html={item.organization || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("volunteer", originalIdx, val, "organization")} />
                                                </div>
                                                <div style={styles.refDetail}>
                                                    <RichTextSpellCheck html={item.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("volunteer", originalIdx, val, "role")} />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", color: DARK }}>
                                                    <RichTextSpellCheck html={item.organization || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("volunteer", originalIdx, val, "organization")} />
                                                </div>
                                                <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: "#555", marginTop: "2px" }}>
                                                    <RichTextSpellCheck html={item.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("volunteer", originalIdx, val, "role")} />
                                                </div>
                                                <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: "#888" }}>
                                                    {item.startDate} – {item.isCurrent ? "Present" : item.endDate}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        education: ({ itemIndices, isContinued, zoneId }) => {
            const items = itemIndices ? itemIndices.map((idx) => data.education?.[idx]) : data.education;
            if (!items || items.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div>
                        {isSidebar ? <SidebarTitle title="Education" icon="award" /> : <MainTitle title="Education" icon="award" />}
                        {items.map((edu, i) => {
                            if (!edu) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            if (isSidebar) {
                                return (
                                    <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(14px * var(--theme-paragraph-margin, 1))" }}>
                                        <div style={styles.eduName}>
                                            <div style={styles.eduDot} />
                                            <RichTextSpellCheck
                                                html={edu.institution || edu.school || ""}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace("education", originalIdx, val, "institution")}
                                            />
                                        </div>
                                        <div style={{ paddingLeft: "16px" }}>
                                            <div style={styles.eduDegree}>
                                                <RichTextSpellCheck
                                                    html={edu.degree || ""}
                                                    isActive={isSpellCheckActive}
                                                    onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace("education", originalIdx, val, "degree")}
                                                />
                                            </div>
                                            <div style={styles.eduYear}>
                                                <RichTextSpellCheck
                                                    html={edu.year || edu.endYear || edu.date || ""}
                                                    isActive={isSpellCheckActive}
                                                    onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace("education", originalIdx, val, "year")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            // Main column style
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.expItem}>
                                    <div style={styles.expHeaderRow}>
                                        <span style={styles.expTitle}>
                                            <RichTextSpellCheck html={edu.degree || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("education", originalIdx, val, "degree")} />
                                        </span>
                                        <span style={styles.expDate}>{edu.year || edu.endYear || ""}</span>
                                    </div>
                                    <div style={styles.expCompany}>
                                        <RichTextSpellCheck html={[edu.institution || edu.school, edu.location].filter(Boolean).join(", ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("education", originalIdx, val, "institution")} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        languages: ({ itemIndices, isContinued, zoneId }) => {
            const items = itemIndices ? itemIndices.map((idx) => data.languages?.[idx]) : data.languages;
            if (!items || items.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");
            return (
                <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Languages">
                    <div>
                        {isSidebar ? <SidebarTitle title="Languages" icon="star" /> : <MainTitle title="Languages" icon="star" />}
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((lang, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <LanguageItem
                                        key={i}
                                        item={lang}
                                        index={originalIdx}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(field, val) => onSpellCheckReplace("languages", originalIdx, val, field)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        certifications: ({ itemIndices, isContinued, zoneId, subItemRanges: rSIR }) => {
            const items = itemIndices ? itemIndices.map((idx) => data.certifications?.[idx]) : data.certifications;
            if (!items || items.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");
            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Certifications">
                    <div>
                        {isSidebar ? <SidebarTitle title="Certifications" icon="award" /> : <MainTitle title="Certifications" icon="award" />}
                        {isSidebar ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                                {items.map((cert, i) => {
                                    if (!cert) return null;
                                    const originalIdx = itemIndices ? itemIndices[i] : i;
                                    return (
                                        <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                                            <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", fontWeight: "700", color: "white" }}>
                                                <RichTextSpellCheck html={cert.name || cert.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("certifications", originalIdx, val, "name")} />
                                            </div>
                                            {(cert.issuer || cert.issuingOrganization) && (
                                                <div style={{ fontSize: "calc(10px * var(--theme-font-scale, 1))", color: YELLOW }}>
                                                    {cert.issuer || cert.issuingOrganization}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                                {items.map((cert, i) => {
                                    const originalIdx = itemIndices ? itemIndices[i] : i;
                                    return (
                                        <CertificationItem
                                            key={i}
                                            item={cert}
                                            index={originalIdx}
                                            isSpellCheckActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onSpellCheckReplace={(field, val) => onSpellCheckReplace("certifications", originalIdx, val, field)}
                                            subItemRange={rSIR?.[originalIdx]}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </SectionWrapper>
            );
        },

        interests: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map((idx) => data.interests?.[idx]) : data.interests;
            if (!items || items.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");
            return (
                <SectionWrapper sectionId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div>
                        {isSidebar ? <SidebarTitle title="Interests" icon="star" /> : <MainTitle title="Interests" icon="star" />}
                        {isSidebar ? (
                            <ul style={{ paddingLeft: "14px", margin: 0 }}>
                                {items.map((item, i) => (
                                    <li key={i} data-item-index={itemIndices ? itemIndices[i] : i} style={{ fontSize: "calc(10.5px * var(--theme-font-scale, 1))", color: "rgba(255,255,255,0.8)", lineHeight: "var(--theme-line-height, 1.5)", marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))" }}>
                                        <RichTextSpellCheck html={typeof item === "object" ? item.name : item} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("interests", itemIndices ? itemIndices[i] : i, val, "name")} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <ul style={{ paddingLeft: "16px", margin: 0 }}>
                                {items.map((item, i) => (
                                    <li key={i} data-item-index={itemIndices ? itemIndices[i] : i} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: "#444", lineHeight: "var(--theme-line-height, 1.55)", marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))" }}>
                                        <RichTextSpellCheck html={typeof item === "object" ? item.name : item} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("interests", itemIndices ? itemIndices[i] : i, val, "name")} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </SectionWrapper>
            );
        },

        awards: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map((idx) => data.awards?.[idx]) : data.awards;
            if (!items || items.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");
            return (
                <SectionWrapper sectionId="awards" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Awards">
                    <div>
                        {isSidebar ? <SidebarTitle title="Awards" icon="award" /> : <MainTitle title="Awards" icon="award" />}
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((award, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIdx} style={{ fontSize: isSidebar ? "calc(10.5px * var(--theme-font-scale, 1))" : "calc(12px * var(--theme-font-scale, 1))" }}>
                                        <div style={{ fontWeight: "700", color: isSidebar ? "white" : DARK }}>
                                            <RichTextSpellCheck html={award.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("awards", originalIdx, val, "title")} />
                                        </div>
                                        <div style={{ color: YELLOW, fontStyle: "italic" }}>
                                            <RichTextSpellCheck html={award.issuer} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("awards", originalIdx, val, "issuer")} />
                                            {award.year && <span style={{ color: isSidebar ? "rgba(255,255,255,0.55)" : "#888" }}> • {award.year}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // ======= MAIN RENDERERS =======
        summary: ({ isContinued, subItemRanges, zoneId }) => (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Summary">
                <div>
                    <MainTitle title="About Me" icon="user" />
                    <div className="resume-rich-text" style={styles.summaryText}>
                        <SplittableRichText
                            html={data.summary}
                            range={subItemRanges?.summary}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace("summary", "summary", val)}
                        />
                    </div>
                </div>
            </SectionWrapper>
        ),

        experience: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map((idx) => data.experience?.[idx]) : data.experience;
            if (!items || items.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");

            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Experience">
                    <div>
                        {isSidebar ? <SidebarTitle title="Experience" icon="star" /> : <MainTitle title="Job Experience" icon="star" />}
                        {items.map((exp, i) => {
                            if (!exp) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = exp.year || exp.date || (exp.startYear ? `${exp.startYear} – ${exp.isCurrent ? "Present" : exp.endYear}` : "");
                            const companyStr = [exp.company, exp.location].filter(Boolean).join(" / ");

                            if (isSidebar) {
                                return (
                                    <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(16px * var(--theme-paragraph-margin, 1))" }}>
                                        <div style={{ ...styles.refName, color: YELLOW }}>
                                            <RichTextSpellCheck html={exp.title || exp.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("experience", originalIdx, val, "title")} />
                                        </div>
                                        <div style={{ fontSize: "calc(10.5px * var(--theme-font-scale, 1))", fontWeight: "700", color: "white" }}>
                                            <RichTextSpellCheck html={companyStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("experience", originalIdx, val, "company")} />
                                        </div>
                                        <div style={{ fontSize: "calc(10px * var(--theme-font-scale, 1))", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>
                                            <RichTextSpellCheck html={dateStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("experience", originalIdx, val, "date")} />
                                        </div>
                                        <div className="resume-rich-text" style={{ fontSize: "calc(10.5px * var(--theme-font-scale, 1))", color: "rgba(255,255,255,0.8)", lineHeight: "1.5" }}>
                                            <SplittableRichText
                                                html={exp.description}
                                                range={subItemRanges?.[originalIdx]}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace("experience", originalIdx, val, "description")}
                                            />
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.expItem}>
                                    <div style={styles.expHeaderRow}>
                                        <span style={styles.expTitle}>
                                            <RichTextSpellCheck html={exp.title || exp.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("experience", originalIdx, val, "title")} />
                                        </span>
                                        {dateStr && (
                                            <span style={styles.expDate}>
                                                <RichTextSpellCheck html={dateStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("experience", originalIdx, val, "date")} />
                                            </span>
                                        )}
                                    </div>
                                    {companyStr && (
                                        <div style={styles.expCompany}>
                                            <RichTextSpellCheck html={companyStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("experience", originalIdx, val, "company")} />
                                        </div>
                                    )}
                                    <div className="resume-rich-text" style={styles.expDesc}>
                                        <SplittableRichText
                                            html={exp.description}
                                            range={subItemRanges?.[originalIdx]}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace("experience", originalIdx, val, "description")}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        skills: ({ itemIndices, isContinued, zoneId }) => {
            const items = itemIndices ? itemIndices.map((idx) => data.skills?.[idx]).filter(Boolean) : (data.skills || []);
            const hasDescription = data.skillsDescription && data.skillsDescription.trim();
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");

            if (items.length > 0) {
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                        <div>
                            {isSidebar ? <SidebarTitle title="Skills" icon="star" /> : <MainTitle title="Skills" icon="star" />}
                            {isSidebar ? (
                                // Sidebar: simple list with yellow dot
                                <div style={{ display: "flex", flexDirection: "column", gap: "calc(6px * var(--theme-paragraph-margin, 1))" }}>
                                    {items.map((skill, i) => {
                                        const originalIdx = itemIndices ? itemIndices[i] : i;
                                        const lvl = typeof skill === "object" ? skill.level ?? skill.rating : null;
                                        return (
                                            <div key={originalIdx} data-item-index={originalIdx} style={styles.sidebarSkillItem}>
                                                <div style={{ ...styles.eduDot, width: "6px", height: "6px" }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                                                        <span style={{ fontSize: "calc(10.5px * var(--theme-font-scale, 1))", color: "white" }}>
                                                            <RichTextSpellCheck html={typeof skill === "object" ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("skills", originalIdx, val, "name")} />
                                                        </span>
                                                    </div>
                                                    {lvl > 0 && (
                                                        <div style={{ ...styles.skillBarTrack, background: "rgba(255,255,255,0.15)" }}>
                                                            <div style={styles.skillBarFill(lvlToPct(lvl))} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                // Main: 2-col progress bar grid
                                <div style={styles.skillsGrid}>
                                    {items.map((skill, i) => {
                                        const originalIdx = itemIndices ? itemIndices[i] : i;
                                        const lvl = typeof skill === "object" ? skill.level ?? skill.rating : null;
                                        const pct = lvlToPct(lvl);
                                        return (
                                            <div key={originalIdx} data-item-index={originalIdx} style={styles.skillBarItem}>
                                                <span style={styles.skillBarLabel}>
                                                    <RichTextSpellCheck html={typeof skill === "object" ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("skills", originalIdx, val, "name")} />
                                                </span>
                                                <div style={styles.skillBarTrack}>
                                                    <div style={styles.skillBarFill(pct)} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </SectionWrapper>
                );
            }

            if (hasDescription) {
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                        <div>
                            {isSidebar ? <SidebarTitle title="Skills" icon="star" /> : <MainTitle title="Skills" icon="star" />}
                            <div className="resume-rich-text" style={isSidebar ? { fontSize: "calc(10.5px * var(--theme-font-scale, 1))", color: "rgba(255,255,255,0.8)", lineHeight: "var(--theme-line-height, 1.5)" } : styles.summaryText}>
                                <SplittableRichText html={data.skillsDescription} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("skills", "skillsDescription", val)} />
                            </div>
                        </div>
                    </SectionWrapper>
                );
            }
            return null;
        },

        strengths: ({ itemIndices, isContinued, zoneId }) => {
            const items = itemIndices ? itemIndices.map((idx) => data.strengths?.[idx]).filter(Boolean) : (data.strengths || []);
            if (items.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div>
                        {isSidebar ? <SidebarTitle title="Key Strengths" icon="star" /> : <MainTitle title="Key Strengths" icon="star" />}
                        <div style={isSidebar ? {} : styles.skillsGrid}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const lvl = typeof skill === "object" ? skill.level ?? skill.rating : null;
                                const pct = lvlToPct(lvl);
                                return isSidebar ? (
                                    <div key={originalIdx} data-item-index={originalIdx} style={styles.sidebarSkillItem}>
                                        <div style={{ ...styles.eduDot, width: "6px", height: "6px" }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: "calc(10.5px * var(--theme-font-scale, 1))", color: "white", marginBottom: "2px" }}>
                                                <RichTextSpellCheck html={typeof skill === "object" ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("strengths", originalIdx, val, "name")} />
                                            </div>
                                            {lvl > 0 && (
                                                <div style={{ ...styles.skillBarTrack, background: "rgba(255,255,255,0.15)" }}>
                                                    <div style={styles.skillBarFill(pct)} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div key={originalIdx} data-item-index={originalIdx} style={styles.skillBarItem}>
                                        <span style={styles.skillBarLabel}>
                                            <RichTextSpellCheck html={typeof skill === "object" ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("strengths", originalIdx, val, "name")} />
                                        </span>
                                        {lvl > 0 && (
                                            <div style={styles.skillBarTrack}>
                                                <div style={styles.skillBarFill(pct)} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        additionalSkills: ({ itemIndices, isContinued, zoneId }) => {
            const items = itemIndices ? itemIndices.map((idx) => data.additionalSkills?.[idx]).filter(Boolean) : (data.additionalSkills || []);
            if (items.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");
            return (
                <SectionWrapper sectionId="additionalSkills" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Skills">
                    <div>
                        {isSidebar ? <SidebarTitle title="Additional Skills" icon="star" /> : <MainTitle title="Additional Skills" icon="star" />}
                        <div style={isSidebar ? { display: "flex", flexDirection: "column", gap: "calc(5px * var(--theme-paragraph-margin, 1))" } : styles.skillsGrid}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const lvl = typeof skill === "object" ? skill.level ?? skill.rating : null;
                                return isSidebar ? (
                                    <div key={originalIdx} data-item-index={originalIdx} style={styles.sidebarSkillItem}>
                                        <div style={{ ...styles.eduDot, width: "6px", height: "6px" }} />
                                        <span style={{ fontSize: "calc(10.5px * var(--theme-font-scale, 1))", color: "rgba(255,255,255,0.82)" }}>
                                            <RichTextSpellCheck html={typeof skill === "object" ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("additionalSkills", originalIdx, val, "name")} />
                                        </span>
                                    </div>
                                ) : (
                                    <div key={originalIdx} data-item-index={originalIdx} style={styles.skillBarItem}>
                                        <span style={styles.skillBarLabel}>
                                            <RichTextSpellCheck html={typeof skill === "object" ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("additionalSkills", originalIdx, val, "name")} />
                                        </span>
                                        {lvl > 0 && <div style={styles.skillBarTrack}><div style={styles.skillBarFill(lvlToPct(lvl))} /></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        software: ({ itemIndices, isContinued, zoneId, subItemRanges: rSIR }) => {
            const items = itemIndices ? itemIndices.map((idx) => data.software?.[idx]) : data.software;
            if (!items || items.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");
            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div>
                        {isSidebar ? <SidebarTitle title="Software" icon="star" /> : <MainTitle title="Software" icon="star" />}
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(7px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <SoftwareItem
                                        key={i}
                                        item={item}
                                        index={originalIdx}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(field, val) => onSpellCheckReplace("software", originalIdx, val, field)}
                                        variant={isSidebar ? "compact" : undefined}
                                        subItemRange={rSIR?.[originalIdx]}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        projects: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map((idx) => data.projects?.[idx]) : data.projects;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div>
                        <MainTitle title="Projects" icon="star" />
                        {items.map((proj, i) => {
                            if (!proj) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = proj.year || (proj.startYear && `${proj.startYear} – ${proj.isCurrent ? "Present" : proj.endYear || "Present"}`);
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.expItem}>
                                    <div style={styles.expHeaderRow}>
                                        <span style={styles.expTitle}>
                                            <RichTextSpellCheck html={proj.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("projects", originalIdx, val, "title")} />
                                        </span>
                                        {dateStr && <span style={styles.expDate}>{dateStr}</span>}
                                    </div>
                                    {proj.link && (
                                        <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: YELLOW, marginBottom: "4px" }}>
                                            <ResumeLink href={proj.link}>
                                                <RichTextSpellCheck html={proj.link} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("projects", originalIdx, val, "link")} />
                                            </ResumeLink>
                                        </div>
                                    )}
                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
                                            {proj.technologies.map((tech, tIdx) => (
                                                <span key={tIdx} style={{ fontSize: "calc(10px * var(--theme-font-scale, 1))", padding: "2px 8px", background: "#e5e5e5", borderRadius: "10px", color: "#444" }}>
                                                    <RichTextSpellCheck html={tech} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => { const u = [...proj.technologies]; u[tIdx] = val; onSpellCheckReplace("projects", originalIdx, u, "technologies"); }} />
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="resume-rich-text" style={styles.expDesc}>
                                        <SplittableRichText html={proj.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("projects", originalIdx, val, "description")} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        custom: ({ isContinued, subItemRanges: rSIR, zoneId }) => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const content = data.customSection.content;
            if (!content || content.trim() === "" || content === "<p><br></p>") return null;
            const title = data.customSection.title || "Additional Information";
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div>
                        <MainTitle title={title} icon="star" />
                        <div className="resume-rich-text" style={styles.summaryText}>
                            <SplittableRichText html={content} range={rSIR?.custom} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("customSection", "content", val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        additionalInfo: ({ isContinued, subItemRanges: rSIR, zoneId }) => {
            const html = data.additionalInfo || "";
            if (!html || html.trim() === "" || html === "<p><br></p>") return null;
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Information">
                    <div>
                        <MainTitle title="Additional Information" icon="star" />
                        <div className="resume-rich-text" style={styles.summaryText}>
                            <SplittableRichText html={html} range={rSIR?.additionalInfo} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("additionalInfo", "additionalInfo", val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        publications: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map((idx) => data.publications?.[idx]) : data.publications;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="publications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Publications">
                    <div>
                        {isSidebar ? <SidebarTitle title="Publications" icon="star" /> : <MainTitle title="Publications" icon="star" />}
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(10px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((pub, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIdx}>
                                        <div style={{ fontWeight: "700", fontSize: isSidebar ? "calc(11px * var(--theme-font-scale, 1))" : "calc(12.5px * var(--theme-font-scale, 1))", color: isSidebar ? "white" : DARK }}>
                                            <RichTextSpellCheck html={pub.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("publications", originalIdx, val, "name")} />
                                        </div>
                                        <div style={{ fontSize: isSidebar ? "calc(10px * var(--theme-font-scale, 1))" : "calc(12px * var(--theme-font-scale, 1))", color: YELLOW, fontStyle: "italic" }}>
                                            <RichTextSpellCheck html={pub.publisher} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("publications", originalIdx, val, "publisher")} />
                                            {pub.releaseDate && <span style={{ color: isSidebar ? "rgba(255,255,255,0.55)" : "#888" }}> • {pub.releaseDate}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        personalDetails: ({ zoneId }) => {
            const { personal: p = {} } = data;
            const details = [
                { label: "Date of Birth", value: p.dob || p.dateOfBirth || p.birthDate },
                { label: "Nationality", value: p.nationality },
                { label: "Marital Status", value: p.maritalStatus || p.marital_status },
                { label: "Gender", value: p.gender },
                { label: "Religion", value: p.religion },
                { label: "Visa Status", value: p.visaStatus || p.visa_status },
                { label: "Passport", value: p.passport || p.passportNumber },
                { label: "Place of Birth", value: p.placeOfBirth },
                { label: "Driving License", value: p.drivingLicense },
                { label: "Other", value: p.otherPersonal || p.otherInformation },
            ].filter((d) => d.value);

            if (details.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");

            return (
                <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                    <div>
                        {isSidebar ? <SidebarTitle title="Personal Info" icon="user" /> : <MainTitle title="Personal Information" icon="user" />}
                        <div style={isSidebar ? {} : { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            {details.map((d, i) => (
                                <div key={i} style={isSidebar ? styles.contactItem : { fontSize: "calc(12px * var(--theme-font-scale, 1))", color: "#444" }}>
                                    {isSidebar && (
                                        <div style={styles.contactDot}>
                                            <SidebarIcon type="user" />
                                        </div>
                                    )}
                                    <div style={isSidebar ? styles.contactText : {}}>
                                        <span style={{ fontWeight: "700" }}>{d.label}: </span>
                                        <SpellCheckText
                                            text={d.value}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace("personal", d.label.toLowerCase().replace(/ /g, ""), val)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
    };

    // --- RENDER ZONE ---
    const renderZone = (id, items, extraStyle = {}) => (
        <DroppableZone id={id} style={extraStyle}>
            {items.map((sid, idx) => {
                const isContinued = typeof sid === "object" && sid.isContinued;
                const sectionId = typeof sid === "string" ? sid : sid.id;
                const dragId = isContinued ? `${id}-cont-${sectionId}-${idx}` : sectionId;
                return (
                    <DraggableSection key={dragId} id={dragId} isEnabled={canReorder && !isContinued}>
                        <div style={{ paddingBottom: "1px" }}>
                            <SectionRenderer
                                sectionId={sectionId}
                                data={data}
                                onSectionClick={onSectionClick}
                                isContinued={isContinued}
                                itemIndices={typeof sid === "object" ? sid.itemIndices : undefined}
                                subItemRanges={typeof sid === "object" ? sid.subItemRanges : undefined}
                                customRenderers={customRenderers}
                                zoneId={id}
                            />
                        </div>
                    </DraggableSection>
                );
            })}
        </DroppableZone>
    );

    // --- MEASURER ---
    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
            <div style={{ ...styles.page, height: "auto" }}>
                {/* Sidebar */}
                <div data-column-id="sidebar" style={styles.sidebarColumn}>
                    <SidebarTop />
                    <div style={styles.sidebarContent}>
                        {activeSidebarSections.map((sid) => (
                            <div key={sid} style={{ paddingBottom: "1px" }}>
                                <SectionRenderer sectionId={sid} data={data} customRenderers={customRenderers} zoneId="sidebar" />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Main */}
                <div data-column-id="main" style={styles.mainColumn}>
                    <Header />
                    <div style={styles.mainContent}>
                        {activeMainSections.map((sid) => (
                            <div key={sid} style={{ paddingBottom: "1px" }}>
                                <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="main" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // --- PAGE RENDER HELPER ---
    const renderPage = (sidebarItems, mainItems, pageIdx, showHeader) => (
        <div style={styles.page}>
            {/* Sidebar */}
            <div style={styles.sidebarColumn}>
                {pageIdx === 0 && <SidebarTop />}
                <div style={styles.sidebarContent}>
                    {renderZone(`sidebar-p${pageIdx}`, sidebarItems, {
                        display: "flex",
                        flexDirection: "column",
                        gap: "calc(20px * var(--theme-section-margin, 1))",
                    })}
                </div>
            </div>
            {/* Main */}
            <div style={styles.mainColumn}>
                {pageIdx === 0 && <Header />}
                <div style={styles.mainContent}>
                    {renderZone(`main-p${pageIdx}`, mainItems, {
                        display: "flex",
                        flexDirection: "column",
                        gap: "calc(20px * var(--theme-section-margin, 1))",
                    })}
                </div>
            </div>
            {pageIdx > 0 && (
                <div style={{ position: "absolute", bottom: "8px", right: "14px", fontSize: "9px", opacity: 0.4 }}>
                    Page {pageIdx + 1}
                </div>
            )}
        </div>
    );

    // --- MAIN RENDER ---
    return (
        <div ref={containerRef} className="amber-graphite-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={[...activeMainSections, ...activeSidebarSections]} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <React.Fragment key={i}>
                                {renderPage(page.sidebar, page.main, i, i === 0)}
                            </React.Fragment>
                        ))
                    ) : (
                        renderPage(activeSidebarSections, activeMainSections, 0, true)
                    )}
                </SortableContext>
                <StableResumeDragOverlay
                    activeId={activeId}
                    scale={scale}
                    renderSection={(id) => (
                        <div style={{ background: "white", padding: "10px", border: "1px solid #ddd", width: "260px" }}>
                            <SectionRenderer sectionId={id} data={data} customRenderers={customRenderers} />
                        </div>
                    )}
                />
            </DndContext>
        </div>
    );
};

export default AmberGraphite;
