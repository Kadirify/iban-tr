#if !NET5_0_OR_GREATER
namespace System.Runtime.CompilerServices
{
    // netstandard2.0'da record için gerekiyor
    internal static class IsExternalInit { }
}
#endif
