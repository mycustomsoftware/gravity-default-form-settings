<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInite950c9833702cc80873d41a46a1ec42f
{
    public static $prefixLengthsPsr4 = array (
        'G' => 
        array (
            'GravityDefaults\\' => 16,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'GravityDefaults\\' => 
        array (
            0 => __DIR__ . '/../..' . '/classes',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInite950c9833702cc80873d41a46a1ec42f::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInite950c9833702cc80873d41a46a1ec42f::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInite950c9833702cc80873d41a46a1ec42f::$classMap;

        }, null, ClassLoader::class);
    }
}