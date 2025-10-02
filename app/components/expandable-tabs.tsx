// "use client";

// import * as React from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { useOnClickOutside } from "usehooks-ts";
// import { cn } from "@/lib/utils";
// import Link from "next/link";

// interface Tab {
//   title: string;
//   icon: React.ReactNode;
//   type?: never;
//   href?: string;
// }

// interface Separator {
//   type: "separator";
//   title?: never;
//   icon?: never;
//   href?: never;
// }

// type TabItem = Tab | Separator;

// interface ExpandableTabsProps {
//   tabs: TabItem[];
//   className?: string;
//   activeColor?: string;
//   onChange?: (index: number | null) => void;
// }

// const buttonVariants = {
//   initial: {
//     gap: 0,
//     paddingLeft: ".5rem",
//     paddingRight: ".5rem",
//   },
//   animate: (isSelected: boolean) => ({
//     gap: isSelected ? ".5rem" : 0,
//     paddingLeft: isSelected ? "1rem" : ".5rem",
//     paddingRight: isSelected ? "1rem" : ".5rem",
//   }),
// };

// const spanVariants = {
//   initial: { width: 0, opacity: 0 },
//   animate: { width: "auto", opacity: 1 },
//   exit: { width: 0, opacity: 0 },
// };

// const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

// export function ExpandableTabs({
//   tabs,
//   className,
//   activeColor = "text-primary",
//   onChange,
// }: ExpandableTabsProps) {
//   const [selected, setSelected] = React.useState<number | null>(null);
//   const outsideClickRef = React.useRef(null);

//   useOnClickOutside(outsideClickRef, () => {
//     setSelected(null);
//     onChange?.(null);
//   });

//   const handleSelect = (index: number) => {
//     setSelected(index);
//     onChange?.(index);
//   };

//   const SeparatorComponent = () => (
//     <div className="mx-1 h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
//   );

//   return (
//     <div
//       ref={outsideClickRef}
//       className={cn(
//         "flex flex-wrap items-center gap-2 rounded-2xl border bg-background p-1 shadow-sm",
//         className
//       )}
//     >
//       {tabs.map((tab, index) => {
//         if (tab.type === "separator") {
//           return <SeparatorComponent key={`separator-${index}`} />;
//         }

//         const TabButton = () => (
//           <motion.button
//             key={tab.title}
//             variants={buttonVariants}
//             initial={false}
//             animate="animate"
//             custom={selected === index}
//             onClick={() => handleSelect(index)}
//             transition={transition}
//             className={cn(
//               "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300",
//               selected === index
//                 ? cn("bg-muted", activeColor)
//                 : "text-muted-foreground hover:bg-muted hover:text-foreground"
//             )}
//           >
//             {tab.icon}
//             <AnimatePresence initial={false}>
//               {selected === index && (
//                 <motion.span
//                   variants={spanVariants}
//                   initial="initial"
//                   animate="animate"
//                   exit="exit"
//                   transition={transition}
//                   className="overflow-hidden"
//                 >
//                   {tab.title}
//                 </motion.span>
//               )}
//             </AnimatePresence>
//           </motion.button>
//         );

//         if (tab.href) {
//           return (
//             <Link href={tab.href} key={tab.title}>
//               <TabButton />
//             </Link>
//           );
//         }

//         return <TabButton key={tab.title} />;
//       })}
//     </div>
//   );
// }


"use client";

import * as React from "react";
import { usePathname } from "next/navigation"; // Import to get the current route
import { AnimatePresence, motion } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Tab {
  title: string;
  icon: React.ReactNode;
  type?: never;
  href?: string;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
  href?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-primary",
  onChange,
}: ExpandableTabsProps) {
  const pathname = usePathname(); // Get the current route
  const outsideClickRef = React.useRef(null);

  // Find the active tab index based on the current route
  // const activeIndex = React.useMemo(
  //   () => tabs.findIndex((tab) => tab.href && pathname.startsWith(tab.href!)),
  //   [pathname, tabs]
  // );

  const activeIndex = React.useMemo(() => {
    return tabs.findIndex((tab) => {
      if (!tab.href) return false;
      if (tab.href === "/") {
        return pathname === "/"; // Match Home only if the exact path is "/"
      }
      return pathname.startsWith(tab.href); // Match other tabs if the pathname starts with their href
    });
  }, [pathname, tabs]);

  const [selected, setSelected] = React.useState<number | null>(activeIndex);

  React.useEffect(() => {
    setSelected(activeIndex); // Update selected tab when route changes
    onChange?.(activeIndex);
  }, [activeIndex, onChange]);

  useOnClickOutside(outsideClickRef, () => {
    setSelected(null);
    onChange?.(null);
  });

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index);
  };

  const SeparatorComponent = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
  );

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border bg-background p-1 shadow-sm",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <SeparatorComponent key={`separator-${index}`} />;
        }

        const isSelected = selected === index;

        const TabButton = () => (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={isSelected}
            onClick={() => handleSelect(index)}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300",
              isSelected
                ? cn("bg-muted", activeColor)
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {tab.icon}
            <AnimatePresence initial={false}>
              {isSelected && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );

        if (tab.href) {
          return (
            <Link href={tab.href} key={tab.title}>
              <TabButton />
            </Link>
          );
        }

        return <TabButton key={tab.title} />;
      })}
    </div>
  );
}
