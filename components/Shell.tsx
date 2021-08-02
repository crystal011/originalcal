import Link from "next/link";
import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";
import { Menu, Transition  } from "@headlessui/react";
import { collectPageParameters, telemetryEventTypes, useTelemetry } from "../lib/telemetry";
import {  SelectorIcon} from "@heroicons/react/outline";
import {
  CalendarIcon,
  ClockIcon,
  PuzzleIcon,
  SupportIcon,
  CogIcon,
  ChatAltIcon,
  LogoutIcon,
  ExternalLinkIcon,
  LinkIcon,
} from "@heroicons/react/solid";
import Logo from "./Logo";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Shell(props) {
  const router = useRouter();
  const [session, loading] = useSession();
  const telemetry = useTelemetry();

  const navigation = [
    {
      name: "Event Types",
      href: "/event-types",
      icon: LinkIcon,
      current: router.pathname.startsWith("/event-types"),
    },
    {
      name: "Bookings",
      href: "/bookings",
      icon: ClockIcon,
      current: router.pathname.startsWith("/bookings"),
    },
    {
      name: "Availability",
      href: "/availability",
      icon: CalendarIcon,
      current: router.pathname.startsWith("/availability"),
    },
    {
      name: "Integrations",
      href: "/integrations",
      icon: PuzzleIcon,
      current: router.pathname.startsWith("/integrations"),
    },
    {
      name: "Settings",
      href: "/settings/profile",
      icon: CogIcon,
      current: router.pathname.startsWith("/settings"),
    },
  ];

  useEffect(() => {
    telemetry.withJitsu((jitsu) => {
      return jitsu.track(telemetryEventTypes.pageView, collectPageParameters(router.pathname));
    });
  }, [telemetry]);

  const logoutHandler = () => {
    signOut({ redirect: false }).then(() => router.push("/auth/logout"));
  };

  if (!loading && !session) {
    router.replace("/auth/login");
  }

  return session ? (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Logo small />
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={classNames(
                        item.current
                          ? "bg-neutral-100 text-neutral-900"
                          : "text-neutral-500 hover:bg-gray-50 hover:text-neutral-900",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-sm"
                      )}>
                      <item.icon
                        className={classNames(
                          item.current ? "text-neutral-500" : "text-neutral-400 group-hover:text-neutral-500",
                          "mr-3 flex-shrink-0 h-5 w-5"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <UserDropdown session={session} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* show top navigation for md and smaller (tablet and phones) */}
        <nav className="md:hidden bg-white shadow p-4 flex justify-between items-center">
          <Link href="/">
            <a>
              <Logo />
            </a>
          </Link>
          <div className="flex gap-3 items-center self-center">
            <button className="bg-white p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">View notifications</span>
              <Link href="/settings/profile">
                <a>
                  <CogIcon className="h-6 w-6" aria-hidden="true" />
                </a>
              </Link>
            </button>
            <div className="mt-1">
              <UserDropdown small bottom session={session} />
            </div>
          </div>
        </nav>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="block sm:flex justify-between px-4 sm:px-6 md:px-8">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">{props.heading}</h1>
                <p className="text-sm text-neutral-500 mr-4">{props.subtitle}</p>
              </div>
              <div className="mb-4 flex-shrink-0">{props.CTA}</div>
            </div>
            <div className="px-4 sm:px-6 md:px-8">{props.children}</div>

            {/* add padding to content for mobile navigation*/}
            <div className="block md:hidden pt-12" />
          </div>
        </main>

        {/* show bottom navigation for md and smaller (tablet and phones) */}
        <nav className="md:hidden flex fixed bottom-0 bg-white w-full rounded-lg shadow">
          {/* note(PeerRich): using flatMap instead of map to remove settings from bottom nav */}
          {navigation.flatMap((item, itemIdx) =>
            item.name === "Settings" ? (
              []
            ) : (
              <Link key={item.name} href={item.href}>
                <a
                  className={classNames(
                    item.current ? "text-gray-900" : "text-neutral-400 hover:text-gray-700",
                    itemIdx === 0 ? "rounded-l-lg" : "",
                    itemIdx === navigation.length - 1 ? "rounded-r-lg" : "",
                    "group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-2 text-xs sm:text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
                  )}
                  aria-current={item.current ? "page" : undefined}>
                  <item.icon
                    className={classNames(
                      item.current ? "text-gray-900" : "text-gray-400 group-hover:text-gray-500",
                      "block mx-auto flex-shrink-0 h-5 w-5 mb-1 text-center"
                    )}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </a>
              </Link>
            )
          )}
        </nav>
      </div>
    </div>
  ) : null;
}

function UserDropdown({session, small, bottom} : {session: any, small?: boolean, bottom?: boolean}){
  return (
    <Menu as="div" className="w-full relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="group w-full rounded-md text-sm text-left font-medium text-gray-700 focus:outline-none">
              <span className="flex w-full justify-between items-center">
                <span className="flex min-w-0 items-center justify-between space-x-3">
                  <img
                    className={classNames(
                      small ? "w-8 h-8" : "w-10 h-10",
                      "bg-gray-300 rounded-full flex-shrink-0"
                    )}
                    src={
                      session.user.image
                        ? session.user.image
                        : "https://eu.ui-avatars.com/api/?background=fff&color=039be5&name=" +
                          encodeURIComponent(session.user.name || "")
                    }
                    alt=""
                  />
                  {!small && (
                    <span className="flex-1 flex flex-col min-w-0">
                      <span className="text-gray-900 text-sm font-medium truncate">{session.user.name}</span>
                      <span className="text-neutral-500 font-normal text-sm truncate">
                        {session.user.username}
                      </span>
                    </span>
                  )}
                </span>
                {!small && (
                  <SelectorIcon
                    className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                )}
              </span>
            </Menu.Button>
          </div>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95">
            <Menu.Items
              static
              className={classNames(
                bottom ? "origin-top top-1 right-0" : "origin-bottom bottom-14 left-0",
                "w-64 z-10 absolute mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
              )}>
              <div className="py-1">
                <a
                  href={"/" + session.user.username}
                  className="flex px-4 py-2 text-sm text-neutral-500 pb-6">
                  View public page <ExternalLinkIcon className="ml-1 w-4 h-4 text-neutral-400" />
                  <span className="absolute top-8 text-neutral-900 font-medium">
                    {window.location.hostname}/bailey
                  </span>
                </a>
              </div>
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-neutral-700",
                        "flex px-4 py-2 text-sm font-medium"
                      )}>
                      <SupportIcon
                        className={classNames(
                          "text-neutral-400 group-hover:text-neutral-500",
                          "mr-2 flex-shrink-0 h-5 w-5"
                        )}
                        aria-hidden="true"
                      />
                      Help
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-neutral-700",
                        "flex px-4 py-2 text-sm font-medium"
                      )}>
                      <ChatAltIcon
                        className={classNames(
                          "text-neutral-400 group-hover:text-neutral-500",
                          "mr-2 flex-shrink-0 h-5 w-5"
                        )}
                        aria-hidden="true"
                      />
                      Feedback
                    </a>
                  )}
                </Menu.Item>
              </div>
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "flex px-4 py-2 text-sm font-medium"
                      )}>
                      <LogoutIcon
                        className={classNames(
                          "text-neutral-400 group-hover:text-neutral-500",
                          "mr-2 flex-shrink-0 h-5 w-5"
                        )}
                        aria-hidden="true"
                      />
                      Sign out
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}